const mongo = require("mongoose");
const {Schema} = mongo;

const companySchema = new Schema({
    c_name : {
        type : String,
        unique : true
    },
    email : {
        type : String,
        unique : true
    },
    mobile : {
        type : Number,
        unique : true
    },
    mobileVerified : {
        type : Boolean,
        default : false
    },
    isLogo : {
        type : Boolean,
        default : false
    },
    logoUrl : {
        type : String,
        default : false
    },
    emailVerified : {
        type : Boolean,
        default : false
    },
    created_at : {
        type : Date,
        default : Date.now()
    },
});

companySchema.pre('save',async function(next){
    const query = {
        c_name : this.c_name
    };

    const cDetail = {
        label : "Company name already exists !",
        field : "company-name",
    }
    const length = await mongo.model("Company").countDocuments(query);
    if(length > 0)
    {
        throw next(cDetail);
    }
    else
    {
        next();
    }
}); 

companySchema.pre('save',async function(next){
    const query = {
        email : this.email
    };

    const cDetail = {
        label : "Company email already exists !",
        field : "company-email",
    }
    const length = await mongo.model("Company").countDocuments(query);
    if(length > 0)
    {
        throw next(cDetail);
    }
    else
    {
        next();
    }
});

module.exports = mongo.model("Company",companySchema);