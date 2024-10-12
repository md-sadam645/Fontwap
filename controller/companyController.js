const tokenService = require("../services/token.services");
const databaseService = require("../services/database.services");

const createCompany = async(request,response)=>{
    const token = tokenService.verifyToken(request)
    if(token.isVerified)
    {
        try{
            const resData = await databaseService.createRecord(token.data,'company');
            response.status(200);
            response.json({
                isCompanyCreated : true,
                data : resData,
                msg : "Company created"
            });
        }
        catch(error)
        {
            response.status(409);
            response.json({
                isCompanyCreated : false,
                data : error
            });
        }
    }
    else
    {
        response.status(401);
        response.json({
            msg : "permission denied"
        });
    }
};

const companyUpdate = async(request,response)=>{
   
    // const token = tokenService.verifyToken(request)
    // if(token.isVerified)
    // {
    //     try{
    //         const resData = await databaseService.createRecord(token.data,'company');
    //         response.status(200);
    //         response.json({
    //             isCompanyCreated : true,
    //             data : resData,
    //             msg : "Company created"
    //         });
    //     }
    //     catch(error)
    //     {
    //         response.status(409);
    //         response.json({
    //             isCompanyCreated : false,
    //             data : error
    //         });
    //     }
    // }
    // else
    // {
    //     response.status(401);
    //     response.json({
    //         msg : "permission denied"
    //     });
    // }
    response.status(200);
    response.json({
        isCompanyExist : true,
        msg : "company available",
        data : request.body
    });
};

const getCompanyId = async (request,response)=>{
    const token = tokenService.verifyToken(request);
    if(token.isVerified)
    {
        const query = {
            email : token.data.email
        }

        const companyRes = await databaseService.getCompanyByQuery(query,'company');
        if(companyRes.length > 0)
        {
            response.status(200);
            response.json({
                isCompanyExist : true,
                msg : "company available",
                data : companyRes
            });
        }else{
            response.status(404);
            response.json({
                isCompanyExist : false,
                msg : "company not found"
            });
        }
    }
    else{
        response.status(401);
        response.json({
            msg : "permission denied"
        });
    }

}

module.exports = {
    createCompany : createCompany,
    getCompanyId : getCompanyId,
    companyUpdate : companyUpdate
}