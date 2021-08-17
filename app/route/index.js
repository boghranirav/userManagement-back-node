const express = require("express");
const router = express.Router();

router.use("/application", require("./applicationRoute"));
router.use("/authentication", require("./authenticationRoute"));
router.use("/designation", require("./designationRoute"));
router.use("/role", require("./roleRoute"));
router.use("/user", require("./userRoute"));
router.use("/vehicle", require("./vehicleRoute"));
router.use("/college", require("./collegeRoute"));
router.use("/product", require("./productRoute"));
router.use("/log", require("./logRoute"));
router.use("/authorization", require("./authorizationRoute"));

module.exports = router;
