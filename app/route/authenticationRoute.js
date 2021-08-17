const express = require("express");
const authentication = require("../controller/authenticationController");
const route = express.Router();

route.post("/login", authentication.userLogin);

module.exports = route;
