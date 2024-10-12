const ajax = require("supertest");

const postRequest = async (request)=>{
    const response  = await ajax(request.endPoint)
    .post(request.api)
    .send(request.token);
    return response;
}

const getRequest = async (request)=>{
    const response  = await ajax(request.endpoint)
    .get(request.api+"/"+request.token)
    .set({'X-Auth-Token' : request.token});
    return response;
}

const putRequest = async (request)=>{
    const response  = await ajax(request.endpoint)
    .put(request.api+"/"+request.token)
    .send({token : request.token});
    return response;
}

module.exports={
    postRequest:postRequest,
    getRequest:getRequest,
    putRequest:putRequest,
}