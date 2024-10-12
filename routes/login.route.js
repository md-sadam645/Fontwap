const express = require('express');
const router = express.Router();
const httpService = require('../services/http.services');
const tokenService = require('../services/token.services');
const bcryptService = require('../services/bcrypt.services');

router.post('/',async (request,response)=>{
    const expiresIn = 120;
    const token = await tokenService.createToken(request,expiresIn);

    const companyRes = await httpService.getRequest({
        endpoint : request.get('origin'),
        api : "/api/private/company",
        token :token
    });

    console.log("company found",companyRes);
 
    if(companyRes.body.isCompanyExist)
    {
        console.log(companyRes);
        // const uid = companyRes.body.data[0]._id;
        // console.log(companyRes.body.data[0]);
        //getting user password
        const data = {
            body : {
                uid : companyRes.body.data[0]._id,
                companyInfo : companyRes.body.data[0]
            },
            endpoint : request.get('origin'),
            iss : request.get('origin')+request.originalUrl,
            api : '/api/private/company'
        };

        const uidToken = await tokenService.createCustomToken(data,expiresIn);
    
        const dataRes = await httpService.getRequest({
            endpoint : request.get('origin'),
            api : "/api/private/user",
            token :uidToken
        });

        console.log("users",uidToken,dataRes);

        if(dataRes.body.isCompanyExist)
        {
            //allow single device login
            /*if(dataRes.body.data[0].isLogged){
                response.status(406);
                response.json({
                    msg : 'Please Logout From Other Device'
                })
                return false;
            }*/

            const realPass = dataRes.body.data[0].password;
            const isLogged = await bcryptService.decrypt(realPass,request.body.password);
            console.log("pass match",isLogged);
            if(isLogged)
            {
                const secondsInOneDays = 86400; //604800
                const authToken = await tokenService.createCustomToken(data,secondsInOneDays)
                console.log("log token",authToken);
                //Token Update in Database
                const dbToken = await httpService.putRequest({
                    endpoint : request.get('origin'),
                    api : '/api/private/user',
                    token : authToken
                });
                console.log("token update",dbToken);
                response.cookie('authToken',authToken,{maxAge:(secondsInOneDays*1000)});

                response.status(200);
                response.json({
                    isLogged : true,
                    msg : "success"
                });
            }
            else{
                response.status(401);
                response.json({
                    isLogged : false,
                    msg : "Wrong Password"
                });
            }
        }else
        {
            response.status(dataRes.status);
            response.json(dataRes.body);
        }
    }
    else
    {
        response.status(companyRes.status);
        response.json(companyRes.body);
    }
});

module.exports = router;