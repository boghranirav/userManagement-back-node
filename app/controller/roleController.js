const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const RESPONSE_STATUS = require("../common/status-variable");

const getRole = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_role, {
      include: [
        {
          model: models.tbl_designation,
          as: "designation",
        },
        {
          model: models.tbl_application,
          as: "application",
        },
      ],
      order: [
        ["role_id", "ASC"],
        ["designation_id", "ASC"],
        ["application_id", "ASC"],
      ],
    });

    return res.status(RESPONSE_STATUS.OK.CODE).json({
      CODE: RESPONSE_STATUS.OK.CODE,
      STATUS: RESPONSE_STATUS.OK.STATUS,
      DATA: response,
      MESSAGE: RESPONSE_STATUS.OK.MESSAGE,
    });
  } catch (error) {
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      CODE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      STATUS: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.STATUS,
      DATA: {},
      MESSAGE: error.message,
    });
  }
};

const createRole = async (req, res, next) => {
  try {
    response = await dbFunction.create(models.tbl_role, req.body);
    return res.status(RESPONSE_STATUS.CREATED.CODE).json({
      CODE: RESPONSE_STATUS.CREATED.CODE,
      STATUS: RESPONSE_STATUS.CREATED.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.CREATED.MESSAGE,
    });
  } catch (error) {
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      CODE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      STATUS: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.STATUS,
      DATA: {},
      MESSAGE: error.message,
    });
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const response = await dbFunction.remove(models.tbl_role, {
      where: { role_id: req.params.rId },
    });
    return res.status(RESPONSE_STATUS.DELETED.CODE).json({
      CODE: RESPONSE_STATUS.DELETED.CODE,
      STATUS: RESPONSE_STATUS.DELETED.STATUS,
      DATA: response,
      MESSAGE: RESPONSE_STATUS.DELETED.MESSAGE,
    });
  } catch (error) {
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      CODE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      STATUS: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.STATUS,
      DATA: {},
      MESSAGE: error.message,
    });
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const response = await dbFunction.findOne(models.tbl_role, {
      where: { role_id: req.params.rId },
      include: [
        {
          model: models.tbl_designation,
          as: "designation",
        },
        {
          model: models.tbl_application,
          as: "application",
        },
      ],
    });
    return res.status(RESPONSE_STATUS.DELETED.CODE).json({
      CODE: RESPONSE_STATUS.DELETED.CODE,
      STATUS: RESPONSE_STATUS.DELETED.STATUS,
      DATA: response,
      MESSAGE: RESPONSE_STATUS.DELETED.MESSAGE,
    });
  } catch (error) {
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      CODE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      STATUS: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.STATUS,
      DATA: {},
      MESSAGE: error.message,
    });
  }
};

const updateRole = async (req, res, next) => {
  try {
    const response = await dbFunction.findAndUpdate(
      models.tbl_role,
      { where: { role_id: req.params.rId } },
      req.body
    );

    return res.status(RESPONSE_STATUS.DELETED.CODE).json({
      CODE: RESPONSE_STATUS.DELETED.CODE,
      STATUS: RESPONSE_STATUS.DELETED.STATUS,
      DATA: response,
      MESSAGE: RESPONSE_STATUS.DELETED.MESSAGE,
    });
  } catch (error) {
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      CODE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE,
      STATUS: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.STATUS,
      DATA: {},
      MESSAGE: error.message,
    });
  }
};

module.exports = {
  getRole: getRole,
  createRole: createRole,
  deleteRole: deleteRole,
  getRoleById: getRoleById,
  updateRole: updateRole,
};
