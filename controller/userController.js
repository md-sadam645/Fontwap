const tokenService = require('../services/token.services');
const databaseService  = require('../services/database.services');

const create = async(request,response)=>{
    const token = await tokenService.verifyToken(request);
    if(token.isVerified)
    {
        try{
            // console.log(token.data)
            //start auto login during signup
            // const uidJson = {
            //     uid : token.data.uid,
            //     companyInfo : token.data.companyInfo
            // };
            const endpoint = request.get('origin') || 'http://'+request.get('host');
    
            const option = {
                body : {
                        uid : token.data.uid,
                        companyInfo : token.data.companyInfo
                    },
                endpoint :endpoint,
                originalUrl : request.originalUrl,
                iss : endpoint+request.originalUrl
            }

            const expiresIn = 86400;
            const newToken = await tokenService.createCustomToken(option,expiresIn);
            token.data['token'] = newToken;
            token.data['expiresIn'] = 86400;
            token.data['isLogged'] = true;
            //End auto login during signup

            // console.log(token.data,"before user response");
            const resData = await databaseService.createRecord(token.data,'user');
            // console.log(resData,"user response");
            response.status(200);
            response.json({
                isUserCreated : true,
                token : newToken,
                msg : "User created"
            });
        }
        catch(error)
        {
            response.status(500);
            response.json({
                isUserCreated : false,
                msg : 'Internal server error'
            });
        }
    }
    else{
        response.status(401);
        response.json({
            msg : 'Permission Denied!'
        });
    }
}

const getPasswordById = async(request,response)=>{
    const token = tokenService.verifyToken(request);
    if(token.isVerified)
    {
        const query = {
            uid :token.data.uid
        };
        const resData = await databaseService.getCompanyByQuery(query,'user');
        if(resData.length > 0){
            response.status(200);
            response.json({
                isCompanyExist : true,
                msg : "success",    
                data : resData
            });
        }
        else{
            response.status(404);
            response.json({
                isCompanyExist : false,
                msg : "company not found"
            });
        }
    }else{
        response.status(401);
        response.json({
            msg : 'Permission Denied!'
        });
    }
}

const createLog = async (request,response)=>{
    const token = tokenService.verifyToken(request);
    if(token.isVerified)
    {
        console.log("create log",token);
        const uid = token.data.uid !== undefined ? token.data.uid : token.data;
        const query = {
            uid : uid
        }

        const data = {
            token : request.body.token,
            expiresIn : 86400,
            isLogged : true,
            updated_at : Date.now(),
        }
        
        const dataRes = await databaseService.updateByQuery(query,'user',data);
        console.log(dataRes);
        response.status(200);
        response.json({
            msg : 'Update Success!'
        });
    }else{
        response.status(401);
        response.json({
            msg : 'Permission Denied!'
        });
    }
}

module.exports = {
    createUser : create,
    getPasswordById : getPasswordById,
    createLog : createLog,
}