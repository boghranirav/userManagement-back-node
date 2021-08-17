const express = require("express");
const logController = require("../controller/logController");

const route = express.Router();
const common = require("../common/common");

route.use(common.jwtDecode);
route.get("/list", logController.getLog);

module.exports = route;
