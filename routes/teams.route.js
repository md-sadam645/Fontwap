const express = require('express');
const router = express.Router();

router.get("/",(request,response)=>{
    response.render("teams");
});

module.exports = router;