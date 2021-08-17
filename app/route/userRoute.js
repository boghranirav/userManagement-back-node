const express = require("express");
const user = require("../controller/userController");

const route = express.Router();
const common = require("../common/common");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

route.use(common.jwtDecode);
route.get("/list", jsonParser, user.getUser);
route.post("/create", jsonParser, user.createUser);
route.delete("/:uId", jsonParser, user.deleteUser);
route.get("/:uId", jsonParser, user.getUserById);
route.patch("/:uId", jsonParser, user.updateUser);
// route.patch("/:uId", user.updatePassword);

module.exports = route;
