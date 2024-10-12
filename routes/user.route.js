const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");

router.post("/",(request,response)=>{
    userController.createUser(request,response);
});

router.get("/:query",(request,response)=>{
    userController.getPasswordById(request,response);
});

router.put("/:id",(request,response)=>{
    userController.createLog(request,response);
});

module.exports = router;