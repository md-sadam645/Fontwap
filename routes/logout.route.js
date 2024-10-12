const express = require('express'); 
const router = express.Router();
const authController = require('../controller/authController');

router.get('/',(request,response)=>{
    authController.logout(request,response);
});

module.exports = router;