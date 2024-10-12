const tokenService = require('../services/token.services');
const dbService = require('../services/database.services');
const { json } = require('express');

const refreshToken = async(uid,request)=>{
    console.log(uid);
    const endpoint = request.get('origin') || 'http://'+request.get('host');
    
    const option = {
        body : uid,
        endpoint :endpoint,
        originalUrl : request.originalUrl,
        iss : endpoint+request.originalUrl
    }
    const expiresIn = 86400;
    const newToken = await tokenService.createCustomToken(option,expiresIn);
    const uidJson = {
        uid : uid
    }
    const updateMe = {
        token : newToken,
        expiresIn : 86400,
        update_at : Date.now()
    }
    const updateRes = await dbService.updateByQuery(uidJson,'user',updateMe);
    console.log(updateRes);
    return newToken;
}

const checkUserLog = async(request,response)=>{
    const dataRes = await tokenService.verifyToken(request);
    if(dataRes.isVerified)
    {
        const data ={
            token : request.cookies.authToken,
            isLogged : true
        }
        const dbRes = await dbService.getCompanyByQuery(data,'user');
        console.log(dbRes);
        if(dbRes.length > 0)
        {
            const newToken = await refreshToken(dataRes.data,request);
            console.log(newToken);
            response.cookie('authToken',newToken,{maxAge:(86400*1000)}); 
            return true; 
        }else{
            return false;
        }
    }else{
        return false;
    }
}

const logout = async(request,response)=>{
    const dataToken = await tokenService.verifyToken(request);
    if(dataToken.isVerified)
    {
        const query = {
            token : request.cookies.authToken
        }
        const updateMe = {
            isLogged : false,
            update_at : Date.now()
        }
        const dataRes = await dbService.updateByQuery(query,'user',updateMe);
        if(dataRes.modifiedCount)
        {
            response.clearCookie('authToken');
            response.redirect('/');
        }else{
            response.redirect('/profile');
        }
    }else{
        response.json({msg : 'Permission Denied'});
    }
}

module.exports = {
    checkUserLog : checkUserLog,
    logout : logout
}