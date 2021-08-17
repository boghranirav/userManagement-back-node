const express = require("express");
const college = require("../controller/collegeController");
const route = express.Router();
const common = require("../common/common");
const upload = require("../common/filterCsv");

route.use(common.jwtDecode);
route.get("/list", college.getCollege);
route.get("/export", college.exportCollege);
route.post("/import", upload.single("file"), college.importCollege);
route.post("/create", college.createCollege);
route.delete("/:cId", college.deleteCollege);
route.get("/:cId", college.getCollegeById);
route.patch("/:cId", college.updateCollege);

module.exports = route;
