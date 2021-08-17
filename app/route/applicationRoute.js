const express = require("express");
const application = require("../controller/applicationController.js");
const common = require("../common/common");
const bodyParser = require("body-parser");
const route = express.Router();
const jsonParser = bodyParser.json();

route.use(common.jwtDecode);
route.get("/list", jsonParser, application.getApplication);
route.post("/create", jsonParser, application.createApplication);
route.delete("/:appId", jsonParser, application.deleteApplication);
route.get("/:appId", jsonParser, application.getApplicationById);
route.patch("/:appId", jsonParser, application.updateApplication);

module.exports = route;
