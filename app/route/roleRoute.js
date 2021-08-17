const express = require("express");
const role = require("../controller/roleController.js");
const route = express.Router();

const common = require("../common/common");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

route.use(common.jwtDecode);
console.log("GET REQ");
route.get("/list", jsonParser, role.getRole);
route.post("/create", jsonParser, role.createRole);
route.delete("/:rId", jsonParser, role.deleteRole);
route.get("/:rId", jsonParser, role.getRoleById);
route.patch("/:rId", jsonParser, role.updateRole);

module.exports = route;
