const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const fs = require("fs");
const path = require("path");
const common = require("../common/common");
const formidable = require("formidable");
const RESPONSE_STATUS = require("../common/status-variable");
const CsvParser = require("json2csv").Parser;
const csv = require("fast-csv");
const pathJoin = require("path");

const getProduct = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_product, {
      order: [["product_id", "ASC"]],
    });

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.OK.CODE,
      logMsg: RESPONSE_STATUS.OK.MESSAGE,
    });

    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.OK.CODE,
      STATUS: RESPONSE_STATUS.OK.STATUS,
      DATA: response,
      MESSAGE: RESPONSE_STATUS.OK.MESSAGE,
    });
  } catch (error) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: error.message,
    });
    return res
      .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const createProduct = async (req, res, next) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const { name, manufacturer, price, description } = fields;
      const { image } = files;

      const createObject = {
        name: name,
        manufacturer: manufacturer,
        price: price,
        description: description,
        created_by: 2, //req.userData.user.userId,
        //created_at: new Date(),
      };

      const createProduct = await dbFunction.create(
        models.tbl_product,
        createObject
      );

      if (createProduct && image) {
        var ext = image.name.substring(
          image.name.indexOf("."),
          image.name.length
        );

        var NewName = common.GetUserNameFromDate();

        if (ext.indexOf("?") > -1) {
          ext = ext.substring(0, ext.indexOf("?"));
        }

        form.uploadDir = __dirname + "/Image/product/" + NewName + ext;
        var imagePath =
          path.join(__dirname, "/Image/product") + "/" + NewName + ext;

        const updateProductImage = await createProduct.update({
          image: NewName + ext,
        });

        var rawData = fs.readFileSync(image.path);
        if (updateProductImage) {
          fs.writeFile(imagePath, rawData, function (err) {
            if (err) {
              common.createHistoryLogs(req, {
                sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
                logMsg: err.message,
              });
            }
          });
        }
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.PRODUCT.CREATE.CODE,
          logMsg: RESPONSE_STATUS.PRODUCT.CREATE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.OK.CODE).json({
          CODE: RESPONSE_STATUS.PRODUCT.CREATE.CODE,
          STATUS: RESPONSE_STATUS.PRODUCT.CREATE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.PRODUCT.CREATE.MESSAGE,
        });
      } else {
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.VEHICLE.ERROR.CODE,
          logMsg: RESPONSE_STATUS.VEHICLE.ERROR.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.VEHICLE.ERROR.CODE).json({
          CODE: RESPONSE_STATUS.VEHICLE.ERROR.CODE,
          STATUS: RESPONSE_STATUS.VEHICLE.ERROR.STATUS,
          DATA: response,
          MESSAGE: RESPONSE_STATUS.VEHICLE.ERROR.MESSAGE,
        });
      }
    });
  } catch (err) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: err.message,
    });
    return res
      .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = req.params.pId;
  try {
    const getProduct = await dbFunction.findOne(models.tbl_product, {
      where: { product_id: id },
    });
    // getProduct.dataValues.image
    if (getProduct) {
      const removeResponse = await dbFunction.remove(models.tbl_product, {
        where: { product_id: id },
      });

      if (removeResponse) {
        const imgPath =
          __dirname + "/Image/product/" + getProduct.dataValues.image;

        fs.unlink(imgPath, (err) => console.log(err));

        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.PRODUCT.DELETE.CODE,
          logMsg: RESPONSE_STATUS.PRODUCT.DELETE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.PRODUCT.DELETE.CODE).json({
          CODE: RESPONSE_STATUS.PRODUCT.DELETE.CODE,
          STATUS: RESPONSE_STATUS.PRODUCT.DELETE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.PRODUCT.DELETE.MESSAGE,
        });
      } else {
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.PRODUCT.ERROR_DEL.CODE,
          logMsg: RESPONSE_STATUS.PRODUCT.ERROR_DEL.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.PRODUCT.ERROR_DEL.CODE).json({
          CODE: RESPONSE_STATUS.PRODUCT.ERROR_DEL.CODE,
          STATUS: RESPONSE_STATUS.PRODUCT.ERROR_DEL.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.PRODUCT.ERROR_DEL.MESSAGE,
        });
      }
    } else {
      common.createHistoryLogs(req, {
        sCode: RESPONSE_STATUS.PRODUCT.ERROR_DEL.CODE,
        logMsg: RESPONSE_STATUS.PRODUCT.ERROR_DEL.MESSAGE,
      });

      return res.status(RESPONSE_STATUS.PRODUCT.ERROR_DEL.CODE).json({
        CODE: RESPONSE_STATUS.PRODUCT.ERROR_DEL.CODE,
        STATUS: RESPONSE_STATUS.PRODUCT.ERROR_DEL.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.PRODUCT.ERROR_DEL.MESSAGE,
      });
    }
  } catch (error) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: error.message,
    });
    return res
      .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const response = await dbFunction.findOne(models.tbl_product, {
      where: { product_id: req.params.pId },
    });
  } catch (error) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: error.message,
    });
    return res
      .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const updateProduct = async (req, res, next) => {
  const id = req.params.pId;

  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const { name, manufacturer, price, description } = fields;
      const { image } = files;

      const getProduct = await dbFunction.findOne(models.tbl_product, {
        where: { product_id: id },
      });

      const productObject = {
        name,
        manufacturer,
        price,
        description,
        updated_by: 2,
      };

      if (getProduct) {
        const updateProduct = await dbFunction.update(
          models.tbl_product,
          {
            where: { product_id: id },
          },
          productObject
        );

        if (updateProduct && image) {
          const imgOldPath =
            __dirname + "/Image/product/" + getProduct.dataValues.image;

          if (imgOldPath) fs.unlink(imgOldPath, (err) => console.log(err));

          var ext = image.name.substring(
            image.name.indexOf("."),
            image.name.length
          );
          // Set Image Name Using GetUserNameFromDate() function
          var NewName = common.GetUserNameFromDate();
          // Get Image Extension
          if (ext.indexOf("?") > -1) {
            ext = ext.substring(0, ext.indexOf("?"));
          }

          form.uploadDir = __dirname + "/Image/product/" + NewName + ext;
          var imagePath =
            path.join(__dirname, "/Image/product") + "/" + NewName + ext;
          // Update Image Value In Above created product
          const updateProductImage = await dbFunction.update(
            models.tbl_product,
            { where: { product_id: id } },
            {
              image: NewName + ext,
            }
          );
          // Set RawData as Buffer Value because of adding file in folder
          var rawData = fs.readFileSync(image.path);
          if (updateProductImage) {
            fs.writeFile(imagePath, rawData, function (err) {
              if (err) {
                common.createHistoryLogs(req, {
                  sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
                  logMsg: err.message,
                });
              }
            });
          }
          common.createHistoryLogs(req, {
            sCode: RESPONSE_STATUS.PRODUCT.UPDATE.CODE,
            logMsg: RESPONSE_STATUS.PRODUCT.UPDATE.MESSAGE,
          });

          return res.status(RESPONSE_STATUS.PRODUCT.UPDATE.CODE).json({
            CODE: RESPONSE_STATUS.PRODUCT.UPDATE.CODE,
            STATUS: RESPONSE_STATUS.PRODUCT.UPDATE.STATUS,
            DATA: {},
            MESSAGE: RESPONSE_STATUS.PRODUCT.UPDATE.MESSAGE,
          });
        } else {
          common.createHistoryLogs(req, {
            sCode: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.CODE,
            logMsg: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.MESSAGE,
          });

          return res.status(RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.CODE).json({
            CODE: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.CODE,
            STATUS: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.STATUS,
            DATA: {},
            MESSAGE: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.MESSAGE,
          });
        }
      } else {
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.CODE,
          logMsg: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.CODE).json({
          CODE: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.CODE,
          STATUS: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.PRODUCT.ERROR_UPDATE.MESSAGE,
        });
      }
    });
  } catch (error) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: error.message,
    });
    return res
      .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const exportProduct = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_product, {});
    let product = [];

    response.forEach((item) => {
      const { product_id, name, manufacturer, price, description, created_at } =
        item;

      product.push({
        product_id,
        name,
        manufacturer,
        price,
        description,
        created_at,
      });
    });

    const csvFields = [
      "PRODUCT_ID",
      "NAME",
      "MANUFACTURER",
      "PRICE",
      "DESCRIPTION",
      "CREATED_AT",
    ];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(product);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=product.csv");

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.PRODUCT.EXPORT_CSV.CODE,
      logMsg: RESPONSE_STATUS.PRODUCT.EXPORT_CSV.MESSAGE,
    });
    return res.status(RESPONSE_STATUS.PRODUCT.EXPORT_CSV.CODE).end(csvData);
  } catch (error) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: error.message,
    });
    return res
      .status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const importProduct = async (req, res) => {
  try {
    if (req.file == undefined) {
      common.createHistoryLogs(req, {
        sCode: RESPONSE_STATUS.IMPORT_CSV_ERROR.CODE,
        logMsg: RESPONSE_STATUS.IMPORT_CSV_ERROR.MESSAGE,
      });

      return res.status(RESPONSE_STATUS.IMPORT_CSV_ERROR.CODE).json({
        CODE: RESPONSE_STATUS.IMPORT_CSV_ERROR.CODE,
        STATUS: RESPONSE_STATUS.IMPORT_CSV_ERROR.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.IMPORT_CSV_ERROR.MESSAGE,
      });
    }

    let product = [];
    let path = pathJoin.join(
      __dirname,
      "..",
      "resourse/csv/",
      req.file.filename
    );

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        product.push({
          name: row.name,
          manufacturer: row.manufacturer,
          price: row.price,
          description: row.description,
          created_by: req.userData.user.user_id,
        });
      })
      .on("end", () => {
        models.tbl_product
          .bulkCreate(product)
          .then(() => {
            common.createHistoryLogs(req, {
              sCode: RESPONSE_STATUS.PRODUCT.IMPORT_CSV.CODE,
              logMsg: RESPONSE_STATUS.PRODUCT.IMPORT_CSV.MESSAGE,
            });

            return res.status(RESPONSE_STATUS.PRODUCT.IMPORT_CSV.CODE).json({
              CODE: RESPONSE_STATUS.PRODUCT.IMPORT_CSV.CODE,
              STATUS: RESPONSE_STATUS.PRODUCT.IMPORT_CSV.STATUS,
              DATA: {},
              MESSAGE: RESPONSE_STATUS.PRODUCT.IMPORT_CSV.MESSAGE,
            });
          })
          .catch((error) => {
            common.createHistoryLogs(req, {
              sCode: RESPONSE_STATUS.IMPORT_CSV_ERROR.CODE,
              logMsg: error.message,
            });

            return res.status(RESPONSE_STATUS.IMPORT_CSV_ERROR.CODE).json({
              CODE: RESPONSE_STATUS.IMPORT_CSV_ERROR.CODE,
              STATUS: RESPONSE_STATUS.IMPORT_CSV_ERROR.STATUS,
              DATA: {},
              MESSAGE: RESPONSE_STATUS.IMPORT_CSV_ERROR.MESSAGE,
            });
          });
      });
  } catch (error) {
    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      logMsg: error.message,
    });

    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      CODE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      STATUS: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.MESSAGE,
    });
  }
};

module.exports = {
  getProduct: getProduct,
  createProduct: createProduct,
  deleteProduct: deleteProduct,
  getProductById: getProductById,
  updateProduct: updateProduct,
  importProduct: importProduct,
  exportProduct: exportProduct,
};
