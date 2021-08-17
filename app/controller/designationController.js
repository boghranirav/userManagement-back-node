const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const { Op } = require("sequelize");
const RESPONSE_STATUS = require("../common/status-variable");

const getDesignation = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_designation, {
      where: {
        designation_id: { [Op.notIn]: [1] },
      },
      order: [["designation_id", "ASC"]],
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

const createDesignation = async (req, res, next) => {
  try {
    await dbFunction.create(models.tbl_designation, req.body);

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

const deleteDesignation = async (req, res, next) => {
  try {
    await dbFunction.remove(models.tbl_designation, {
      where: { designation_id: { [Op.notIn]: [1], [Op.in]: [req.params.dId] } },
    });
    return res.status(RESPONSE_STATUS.DELETED.CODE).json({
      CODE: RESPONSE_STATUS.DELETED.CODE,
      STATUS: RESPONSE_STATUS.DELETED.STATUS,
      DATA: {},
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

const getDesignationById = async (req, res, next) => {
  try {
    const response = await dbFunction.findOne(models.tbl_designation, {
      where: { designation_id: { [Op.notIn]: [1], [Op.in]: [req.params.dId] } },
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

const updateDesignation = async (req, res, next) => {
  let response;

  try {
    response = await dbFunction.findOne(models.tbl_designation, {
      where: {
        designation_id: { [Op.notIn]: [1], [Op.in]: [req.params.dId] },
      },
    });

    if (response) {
      response = await dbFunction.update(
        models.tbl_designation,
        { where: { designation_id: req.params.dId } },
        req.body
      );

      return res.status(RESPONSE_STATUS.UPDATED.CODE).json({
        CODE: RESPONSE_STATUS.UPDATED.CODE,
        STATUS: RESPONSE_STATUS.UPDATED.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.UPDATED.MESSAGE,
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR_SAVE.CODE).json({
        CODE: RESPONSE_STATUS.ERROR_SAVE.CODE,
        STATUS: RESPONSE_STATUS.ERROR_SAVE.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.ERROR_SAVE.MESSAGE,
      });
    }
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
  getDesignation: getDesignation,
  createDesignation: createDesignation,
  deleteDesignation: deleteDesignation,
  getDesignationById: getDesignationById,
  updateDesignation: updateDesignation,
};
