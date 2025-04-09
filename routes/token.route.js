const express = require("express");
const router = express.Router();
const tokenController = require("../controller/tokenController");

router.post("/:expires", (req, res) => {
  tokenController.getToken(req, res);
});

module.exports = router;
