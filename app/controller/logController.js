const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const RESPONSE_STATUS = require("../common/status-variable");

const getLog = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_login_log, {
      include: [
        {
          model: models.tbl_user,
          as: "user",
        },
      ],
      attributes: { exclude: ["password"] },
      order: [["log_id", "ASC"]],
    });

    return res.status(RESPONSE_STATUS.COLLEGE.ERROR_DEL.CODE).json({
      CODE: RESPONSE_STATUS.COLLEGE.ERROR_DEL.CODE,
      STATUS: RESPONSE_STATUS.COLLEGE.ERROR_DEL.STATUS,
      DATA: response,
      MESSAGE: RESPONSE_STATUS.COLLEGE.ERROR_DEL.MESSAGE,
    });
  } catch (error) {}
};

const createLog = async (req, res, next) => {
  let response;
  try {
    response = await dbFunction.create(models.tbl_login_log, req.body);
  } catch (error) {}
  res.json({ log: response });
};

const getLogById = async (req, res, next) => {
  let response;
  try {
    response = await dbFunction.findOne(models.tbl_login_log, {
      where: { log_id: req.params.logId },
    });
  } catch (error) {}
  res.json({ log: response });
};

module.exports = {
  getLog: getLog,
  createLog: createLog,
  getLogById: getLogById,
};
