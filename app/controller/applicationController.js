const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const RESPONSE_STATUS = require("../common/status-variable");
const common = require("../common/common");

const getApplication = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_application, {
      order: [["application_id", "ASC"]],
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

const createApplication = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const response = await dbFunction.create(models.tbl_application, {
      name: name.trim(),
      description: description.trim(),
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

const deleteApplication = async (req, res, next) => {
  const applicationId = req.params.appId;
  try {
    const response = await dbFunction.remove(models.tbl_application, {
      where: { application_id: applicationId },
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

const getApplicationById = async (req, res, next) => {
  const applicationId = req.params.appId;
  try {
    const response = await dbFunction.findOne(models.tbl_application, {
      where: { application_id: applicationId },
    });

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.OK.CODE,
      logMsg: RESPONSE_STATUS.OK.MESSAGE,
    });
    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.OK.CODE,
      STATUS: RESPONSE_STATUS.OK.STATUS,
      DATA: { response },
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

const updateApplication = async (req, res, next) => {
  try {
    const response = await dbFunction.findAndUpdate(
      models.tbl_application,
      { where: { application_id: req.params.appId } },
      req.body
    );

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

module.exports = {
  getApplication: getApplication,
  createApplication: createApplication,
  deleteApplication: deleteApplication,
  getApplicationById: getApplicationById,
  updateApplication: updateApplication,
};
