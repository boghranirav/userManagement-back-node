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

const getVehicle = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_vehicle, {
      order: [["vehicle_id", "ASC"]],
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

const createVehicle = async (req, res, next) => {
  try {
    const { name, manufacturer, vehicle_type, fuel_type, colour, price } =
      req.body;
    await dbFunction.create(models.tbl_vehicle, {
      name,
      manufacturer,
      vehicle_type,
      fuel_type,
      colour,
      price,
      created_by: req.userData.user.user_id,
    });

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.VEHICLE.CREATE.CODE,
      logMsg: RESPONSE_STATUS.VEHICLE.CREATE.MESSAGE,
    });

    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.VEHICLE.CREATE.CODE,
      STATUS: RESPONSE_STATUS.VEHICLE.CREATE.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.VEHICLE.CREATE.MESSAGE,
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

const deleteVehicle = async (req, res, next) => {
  try {
    await dbFunction.remove(models.tbl_vehicle, {
      where: { vehicle_id: req.params.vId },
    });

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.VEHICLE.DELETE.CODE,
      logMsg: RESPONSE_STATUS.VEHICLE.DELETE.MESSAGE,
    });

    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.VEHICLE.DELETE.CODE,
      STATUS: RESPONSE_STATUS.VEHICLE.DELETE.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.VEHICLE.DELETE.MESSAGE,
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

const getVehicleById = async (req, res, next) => {
  try {
    await dbFunction.findOne(models.tbl_vehicle, {
      where: { vehicle_id: req.params.vId },
    });

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.OK.CODE,
      logMsg: RESPONSE_STATUS.OK.MESSAGE,
    });

    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.OK.CODE,
      STATUS: RESPONSE_STATUS.OK.STATUS,
      DATA: {},
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

const updateVehicle = async (req, res, next) => {
  try {
    const {
      vehicle_id,
      name,
      manufacturer,
      vehicle_type,
      fuel_type,
      colour,
      price,
    } = req.body;
    response = await dbFunction.findAndUpdate(
      models.tbl_vehicle,
      { where: { vehicle_id: req.params.vId } },
      {
        name,
        manufacturer,
        vehicle_type,
        fuel_type,
        colour,
        price,
        updated_by: req.userData.user.user_id,
      }
    );

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.VEHICLE.UPDATE.CODE,
      logMsg: RESPONSE_STATUS.VEHICLE.UPDATE.MESSAGE,
    });

    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.VEHICLE.UPDATE.CODE,
      STATUS: RESPONSE_STATUS.VEHICLE.UPDATE.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.VEHICLE.UPDATE.MESSAGE,
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

const getVehicleImagesById = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_vehicle_image, {
      where: { vehicle_id: req.params.vId },
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

const createVehicleImage = async (req, res, next) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const { vehicle_id } = fields;
      const { image } = files;
      const createObject = {
        vehicle_id: vehicle_id,
      };

      const createProduct = await dbFunction.create(
        models.tbl_vehicle_image,
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
        form.uploadDir = __dirname + "/Image/vehicle/" + NewName + ext;
        var imagePath =
          path.join(__dirname, "/Image/vehicle") + "/" + NewName + ext;

        const updateProductImage = await createProduct.update({
          image_path: NewName + ext,
        });

        var rawData = fs.readFileSync(image.path);
        if (updateProductImage) {
          fs.writeFile(imagePath, rawData, function (err) {
            if (err) console.log(err);
          });
        }
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.VEHICLE.CREATE_IMAGE.CODE,
          logMsg: RESPONSE_STATUS.VEHICLE.CREATE_IMAGE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.OK.CODE).json({
          CODE: RESPONSE_STATUS.VEHICLE.CREATE_IMAGE.CODE,
          STATUS: RESPONSE_STATUS.VEHICLE.CREATE_IMAGE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.VEHICLE.CREATE_IMAGE.MESSAGE,
        });
      } else {
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.VEHICLE.ERROR.CODE,
          logMsg: RESPONSE_STATUS.VEHICLE.ERROR.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.VEHICLE.ERROR.CODE).json({
          CODE: RESPONSE_STATUS.VEHICLE.ERROR.CODE,
          STATUS: RESPONSE_STATUS.VEHICLE.ERROR.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.VEHICLE.ERROR.MESSAGE,
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

const deleteVehicleImage = async (req, res, next) => {
  const id = req.params.vId;
  try {
    const getImage = await dbFunction.findOne(models.tbl_vehicle_image, {
      where: { image_id: id },
    });

    if (getImage) {
      const removeResponse = await dbFunction.remove(models.tbl_vehicle_image, {
        where: { image_id: id },
      });

      if (removeResponse) {
        const imgPath =
          __dirname + "/Image/vehicle/" + getImage.dataValues.image_path;

        fs.unlink(imgPath, (err) => console.log(err));

        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.VEHICLE.DELETE_IMG.CODE,
          logMsg: RESPONSE_STATUS.VEHICLE.DELETE_IMG.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.VEHICLE.DELETE_IMG.CODE).json({
          CODE: RESPONSE_STATUS.VEHICLE.DELETE_IMG.CODE,
          STATUS: RESPONSE_STATUS.VEHICLE.DELETE_IMG.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.VEHICLE.DELETE_IMG.MESSAGE,
        });
      }
    } else {
      common.createHistoryLogs(req, {
        sCode: RESPONSE_STATUS.VEHICLE.ERROR.CODE,
        logMsg: RESPONSE_STATUS.VEHICLE.ERROR.MESSAGE,
      });

      return res.status(RESPONSE_STATUS.VEHICLE.ERROR.CODE).json({
        CODE: RESPONSE_STATUS.VEHICLE.ERROR.CODE,
        STATUS: RESPONSE_STATUS.VEHICLE.ERROR.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.VEHICLE.ERROR.MESSAGE,
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

const exportVehicle = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_vehicle, {});

    let vehicle = [];

    response.forEach((item) => {
      const {
        vehicle_id,
        name,
        manufacturer,
        vehicle_type,
        fuel_type,
        colour,
        price,
      } = item;
      vehicle.push({
        vehicle_id,
        name,
        manufacturer,
        vehicle_type,
        fuel_type,
        colour,
        price,
      });
    });

    const csvFields = [
      "Id",
      "NAME",
      "MANUFACTURER",
      "TYPE",
      "FUEL_TYPE",
      "COLOUR",
      "PRICE",
    ];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(vehicle);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=vehicle.csv");

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.VEHICLE.EXPORT_CSV.CODE,
      logMsg: RESPONSE_STATUS.VEHICLE.EXPORT_CSV.MESSAGE,
    });
    return res.status(RESPONSE_STATUS.VEHICLE.EXPORT_CSV.CODE).end(csvData);
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

const importVehicle = async (req, res) => {
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

    let vehicle = [];
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
        vehicle.push({
          name: row.name,
          manufacturer: row.manufacturer,
          vehicle_type: row.vehicle_type,
          fuel_type: row.fuel_type,
          colour: row.colour,
          price: row.price,
          created_by: req.userData.user.user_id,
        });
      })
      .on("end", () => {
        models.tbl_vehicle
          .bulkCreate(vehicle)
          .then(() => {
            common.createHistoryLogs(req, {
              sCode: RESPONSE_STATUS.VEHICLE.IMPORT_CSV.CODE,
              logMsg: RESPONSE_STATUS.VEHICLE.IMPORT_CSV.MESSAGE,
            });

            return res.status(RESPONSE_STATUS.VEHICLE.IMPORT_CSV.CODE).json({
              CODE: RESPONSE_STATUS.VEHICLE.IMPORT_CSV.CODE,
              STATUS: RESPONSE_STATUS.VEHICLE.IMPORT_CSV.STATUS,
              DATA: {},
              MESSAGE: RESPONSE_STATUS.VEHICLE.IMPORT_CSV.MESSAGE,
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
  getVehicle: getVehicle,
  createVehicle: createVehicle,
  deleteVehicle: deleteVehicle,
  getVehicleById: getVehicleById,
  updateVehicle: updateVehicle,
  getVehicleImagesById: getVehicleImagesById,
  createVehicleImage: createVehicleImage,
  deleteVehicleImage: deleteVehicleImage,
  exportVehicle: exportVehicle,
  importVehicle: importVehicle,
};
