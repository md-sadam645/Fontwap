const bcrypt = require('bcrypt');

const encrypt = async(data)=>{
    const encrypted = await bcrypt.hash(data,12);
    return encrypted;
}

const decrypt = async(realPass,typedPass)=>{
    const decrypted = await bcrypt.compare(typedPass,realPass);
    return decrypted;
}

module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}