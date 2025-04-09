const express = require("express");
const router = express.Router();
const exporterController = require("../controller/exporterController");

router.post("/", (request, response) => {
  exporterController.pdf(request, response);
});

router.delete("/delete/:filename", (request, response) => {
  exporterController.deletePdf(request, response);
});

module.exports = router;
