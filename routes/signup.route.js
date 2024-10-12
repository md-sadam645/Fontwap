require("dotenv").config();
const express = require('express');
const router = express.Router();
const tokenService = require("../services/token.services");
const httpService = require("../services/http.services");

router.post("/",async(request,response)=>{
    const expiresIn = 120;
    const token = await tokenService.createToken(request,expiresIn);

    const companyRes = await httpService.postRequest({
        endPoint : request.get('origin'),
        api : "/api/private/company",
        token : {token : token}
    });

    if(companyRes.body.isCompanyCreated)
    {
        const newUser = {
            body : 
            {
                uid: companyRes.body.data._id,
                password: request.body.password,
                companyInfo : companyRes.body.data
            },
            endpoint : request.get('origin'),
            api : request.originalUrl,
            iss : request.get('origin')+request.originalUrl
        }

        const userToken = await tokenService.createCustomToken(newUser,expiresIn);
        const userRes = await httpService.postRequest({
            endPoint : request.get('origin'),
            api : "/api/private/user",
            token : {token : userToken}
        });

        //return user response
        response.cookie('authToken',userRes.body.token,{maxAge:(86400*1000)});
        response.status(userRes.status);
        response.json(userRes.body);
    }
    else
    {
        response.status(companyRes.status);
        response.json(companyRes.body);
    }
});

module.exports = router;