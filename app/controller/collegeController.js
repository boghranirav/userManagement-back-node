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

const getCollege = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_college, {
      order: [["college_id", "ASC"]],
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

const createCollege = async (req, res, next) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const { name, address, email_id, mobile_no } = fields;
      const { brochure } = files;

      const createObject = {
        name,
        address,
        email_id,
        mobile_no,
        created_by: 2, //req.userData.user.userId,
        //created_at: new Date(),
      };

      const createCollege = await dbFunction.create(
        models.tbl_college,
        createObject
      );

      if (createCollege && brochure) {
        var ext = brochure.name.substring(
          brochure.name.indexOf("."),
          brochure.name.length
        );

        var NewName = common.GetUserNameFromDate();

        if (ext.indexOf("?") > -1) {
          ext = ext.substring(0, ext.indexOf("?"));
        }

        form.uploadDir = __dirname + "/Image/college/" + NewName + ext;
        var imagePath =
          path.join(__dirname, "/Image/college") + "/" + NewName + ext;

        const updateCollegebrochure = await createCollege.update({
          brochure: NewName + ext,
        });

        var rawData = fs.readFileSync(brochure.path);
        if (updateCollegebrochure) {
          fs.writeFile(imagePath, rawData, function (err) {
            if (err) {
              common.createHistoryLogs(req, {
                sCode: RESPONSE_STATUS.COLLEGE.ERROR.CODE,
                logMsg: err.message,
              });
            }
          });
        }

        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.COLLEGE.CREATE.CODE,
          logMsg: RESPONSE_STATUS.COLLEGE.CREATE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.COLLEGE.CREATE.CODE).json({
          CODE: RESPONSE_STATUS.COLLEGE.CREATE.CODE,
          STATUS: RESPONSE_STATUS.COLLEGE.CREATE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.COLLEGE.CREATE.MESSAGE,
        });
      } else {
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.COLLEGE.ERROR.CODE,
          logMsg: RESPONSE_STATUS.COLLEGE.ERROR.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.COLLEGE.ERROR.CODE).json({
          CODE: RESPONSE_STATUS.COLLEGE.ERROR.CODE,
          STATUS: RESPONSE_STATUS.COLLEGE.ERROR.STATUS,
          DATA: response,
          MESSAGE: RESPONSE_STATUS.COLLEGE.ERROR.MESSAGE,
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

const deleteCollege = async (req, res, next) => {
  const id = req.params.cId;
  try {
    const getCollege = await dbFunction.findOne(models.tbl_college, {
      where: { college_id: id },
    });
    if (getCollege) {
      const removeResponse = await dbFunction.remove(models.tbl_college, {
        where: { college_id: id },
      });

      if (removeResponse) {
        const imgPath =
          __dirname + "/Image/college/" + getCollege.dataValues.brochure;

        fs.unlink(imgPath, (err) => console.log(err));

        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.COLLEGE.DELETE.CODE,
          logMsg: RESPONSE_STATUS.COLLEGE.DELETE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.COLLEGE.DELETE.CODE).json({
          CODE: RESPONSE_STATUS.COLLEGE.DELETE.CODE,
          STATUS: RESPONSE_STATUS.COLLEGE.DELETE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.COLLEGE.DELETE.MESSAGE,
        });
      }
    } else {
      common.createHistoryLogs(req, {
        sCode: RESPONSE_STATUS.COLLEGE.ERROR_DEL.CODE,
        logMsg: RESPONSE_STATUS.COLLEGE.ERROR_DEL.MESSAGE,
      });

      return res.status(RESPONSE_STATUS.COLLEGE.ERROR_DEL.CODE).json({
        CODE: RESPONSE_STATUS.COLLEGE.ERROR_DEL.CODE,
        STATUS: RESPONSE_STATUS.COLLEGE.ERROR_DEL.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.COLLEGE.ERROR_DEL.MESSAGE,
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

const getCollegeById = async (req, res, next) => {
  try {
    const response = await dbFunction.findOne(models.tbl_college, {
      where: { college_id: req.params.cId },
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

const updateCollege = async (req, res, next) => {
  const id = req.params.cId;

  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const { name, email_id, address, mobile_no } = fields;
      const { brochure } = files;
      const getCollege = await dbFunction.findOne(models.tbl_college, {
        where: { college_id: id },
      });

      const collegeObject = {
        name,
        email_id,
        address,
        mobile_no,
        updated_by: 2,
      };

      if (getCollege) {
        const updateCollege = await dbFunction.update(
          models.tbl_college,
          {
            where: { college_id: id },
          },
          collegeObject
        );

        if (updateCollege && brochure) {
          const imgOldPath =
            __dirname + "/Image/college/" + getCollege.dataValues.brochure;

          if (imgOldPath) fs.unlink(imgOldPath, (err) => console.log(err));

          var ext = brochure.name.substring(
            brochure.name.indexOf("."),
            brochure.name.length
          );

          var NewName = common.GetUserNameFromDate();
          // Get Image Extension
          if (ext.indexOf("?") > -1) {
            ext = ext.substring(0, ext.indexOf("?"));
          }

          form.uploadDir = __dirname + "/Image/college/" + NewName + ext;
          var imagePath =
            path.join(__dirname, "/Image/college") + "/" + NewName + ext;
          // Update Image Value In Above created product
          const updateCollegeBrochure = await dbFunction.update(
            models.tbl_college,
            { where: { college_id: id } },
            {
              brochure: NewName + ext,
            }
          );
          var rawData = fs.readFileSync(brochure.path);
          if (updateCollegeBrochure) {
            fs.writeFile(imagePath, rawData, function (err) {
              if (err) {
                common.createHistoryLogs(req, {
                  sCode: RESPONSE_STATUS.COLLEGE.ERROR.CODE,
                  logMsg: err.message,
                });
              }
            });
          }

          common.createHistoryLogs(req, {
            sCode: RESPONSE_STATUS.COLLEGE.UPDATE.CODE,
            logMsg: RESPONSE_STATUS.COLLEGE.UPDATE.MESSAGE,
          });

          return res.status(RESPONSE_STATUS.COLLEGE.UPDATE.CODE).json({
            CODE: RESPONSE_STATUS.COLLEGE.UPDATE.CODE,
            STATUS: RESPONSE_STATUS.COLLEGE.UPDATE.STATUS,
            DATA: {},
            MESSAGE: RESPONSE_STATUS.COLLEGE.UPDATE.MESSAGE,
          });
        } else {
          common.createHistoryLogs(req, {
            sCode: RESPONSE_STATUS.COLLEGE.UPDATE.CODE,
            logMsg: RESPONSE_STATUS.COLLEGE.UPDATE.MESSAGE,
          });

          return res.status(RESPONSE_STATUS.COLLEGE.UPDATE.CODE).json({
            CODE: RESPONSE_STATUS.COLLEGE.UPDATE.CODE,
            STATUS: RESPONSE_STATUS.COLLEGE.UPDATE.STATUS,
            DATA: {},
            MESSAGE: RESPONSE_STATUS.COLLEGE.UPDATE.MESSAGE,
          });
        }
      } else {
        common.createHistoryLogs(req, {
          sCode: RESPONSE_STATUS.COLLEGE.ERROR_UPDATE.CODE,
          logMsg: RESPONSE_STATUS.COLLEGE.ERROR_UPDATE.MESSAGE,
        });

        return res.status(RESPONSE_STATUS.COLLEGE.ERROR_UPDATE.CODE).json({
          CODE: RESPONSE_STATUS.COLLEGE.ERROR_UPDATE.CODE,
          STATUS: RESPONSE_STATUS.COLLEGE.ERROR_UPDATE.STATUS,
          DATA: {},
          MESSAGE: RESPONSE_STATUS.COLLEGE.ERROR_UPDATE.MESSAGE,
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

const exportCollege = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_college, {});
    let college = [];

    response.forEach((item) => {
      const { college_id, name, address, email_id, mobile_no, created_at } =
        item;

      college.push({
        college_id,
        name,
        address,
        email_id,
        mobile_no,
        created_at,
      });
    });

    const csvFields = [
      "COLLEGE_ID",
      "NAME",
      "ADDRESS",
      "EMAIL_ID",
      "MOBILE_NO",
      "CREATED_AT",
    ];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(college);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=college.csv");

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.COLLEGE.EXPORT_CSV.CODE,
      logMsg: RESPONSE_STATUS.COLLEGE.EXPORT_CSV.MESSAGE,
    });
    return res.status(RESPONSE_STATUS.COLLEGE.EXPORT_CSV.CODE).end(csvData);
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

const importCollege = async (req, res) => {
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

    let college = [];
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
        college.push({
          name: row.name,
          address: row.address,
          email_id: row.email_id,
          mobile_no: row.mobile_no,
          created_by: req.userData.user.user_id,
        });
      })
      .on("end", () => {
        models.tbl_college
          .bulkCreate(college)
          .then(() => {
            common.createHistoryLogs(req, {
              sCode: RESPONSE_STATUS.COLLEGE.IMPORT_CSV.CODE,
              logMsg: RESPONSE_STATUS.COLLEGE.IMPORT_CSV.MESSAGE,
            });

            return res.status(RESPONSE_STATUS.COLLEGE.IMPORT_CSV.CODE).json({
              CODE: RESPONSE_STATUS.COLLEGE.IMPORT_CSV.CODE,
              STATUS: RESPONSE_STATUS.COLLEGE.IMPORT_CSV.STATUS,
              DATA: {},
              MESSAGE: RESPONSE_STATUS.COLLEGE.IMPORT_CSV.MESSAGE,
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
  getCollege: getCollege,
  createCollege: createCollege,
  deleteCollege: deleteCollege,
  getCollegeById: getCollegeById,
  updateCollege: updateCollege,
  exportCollege: exportCollege,
  importCollege: importCollege,
};
