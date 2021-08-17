const express = require("express");
const product = require("../controller/productController");
const route = express.Router();
const upload = require("../common/filterCsv");

const common = require("../common/common");

route.use(common.jwtDecode);
route.get("/export", product.exportProduct);

route.get("/list", product.getProduct);
route.post("/create", product.createProduct);
route.post("/import", upload.single("file"), product.importProduct);
route.delete("/:pId", product.deleteProduct);
route.get("/:pId", product.getProductById);
route.patch("/:pId", product.updateProduct);

module.exports = route;
