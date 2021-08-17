const express = require("express");
const vehicle = require("../controller/vehicleController");

const route = express.Router();
const common = require("../common/common");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const upload = require("../common/filterCsv");

route.use(common.jwtDecode);
route.get("/export", vehicle.exportVehicle);
route.get("/list", vehicle.getVehicle);
route.get("/:vId", vehicle.getVehicleById);
route.get("/image/:vId", vehicle.getVehicleImagesById);
route.post("/create", jsonParser, vehicle.createVehicle);

route.post("/import", upload.single("file"), vehicle.importVehicle);
route.post("/image", vehicle.createVehicleImage);
route.delete("/:vId", vehicle.deleteVehicle);
route.delete("/image/:vId", vehicle.deleteVehicleImage);
route.patch("/:vId", jsonParser, vehicle.updateVehicle);

module.exports = route;
