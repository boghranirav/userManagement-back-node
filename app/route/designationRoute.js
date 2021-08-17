const express = require("express");
const designation = require("../controller/designationController");
const route = express.Router();
const common = require("../common/common");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

route.use(common.jwtDecode);
route.get("/list", jsonParser, designation.getDesignation);
route.post("/create", jsonParser, designation.createDesignation);
route.delete("/:dId", jsonParser, designation.deleteDesignation);
route.get("/:dId", jsonParser, designation.getDesignationById);
route.patch("/:dId", jsonParser, designation.updateDesignation);

module.exports = route;
