const express = require("express");
const authorization = require("../controller/authorizationController");
const common = require("../common/common");
const bodyParser = require("body-parser");
const route = express.Router();
const jsonParser = bodyParser.json();

route.use(common.jwtDecode);
route.get("/list", jsonParser, authorization.getApplicationListByDesignation);

module.exports = route;
