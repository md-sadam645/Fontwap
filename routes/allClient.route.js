const express = require("express");
const router = express.Router();
const clientController = require("../controller/clientsController");

router.get("/", (request, response) => {
  response.render("allClient");
});

router.get("/count-all", (request, response) => {
  clientController.clientCount(request, response);
});

router.get("/:from/:to", (request, response) => {
  clientController.paginate(request, response);
});

router.get("/invitation/:token", (request, response) => {
  clientController.invitation(request, response);
});

router.get("/all", (request, response) => {
  clientController.all(request, response);
});

router.delete("/:id", (request, response) => {
  clientController.delete(request, response);
});

router.post("/", (request, response) => {
  clientController.create(request, response);
});

router.put("/:id", (request, response) => {
  clientController.update(request, response);
});

module.exports = router;
