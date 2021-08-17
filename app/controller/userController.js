const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const RESPONSE_STATUS = require("../common/status-variable");

const getUser = async (req, res, next) => {
  try {
    const response = await dbFunction.findAll(models.tbl_user, {
      where: { designation_id: { [Op.notIn]: [1] } },
      include: [
        {
          model: models.tbl_designation,
          as: "designation",
        },
      ],
      attributes: { exclude: ["password"] },
      order: [["user_id", "ASC"]],
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

const createUser = async (req, res, next) => {
  let response;
  const { name, email_id, password, designation_id, mobile_no, address } =
    req.body;

  if (!(email_id && password)) {
    return res.status(RESPONSE_STATUS.EMPTY_DATA.CODE).json({
      CODE: RESPONSE_STATUS.EMPTY_DATA.CODE,
      STATUS: RESPONSE_STATUS.EMPTY_DATA.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.EMPTY_DATA.MESSAGE,
    });
  }

  try {
    const existingUser = await dbFunction.findOne(models.tbl_user, {
      where: { email_id: email_id },
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hPassword = await bcrypt.hash(password, salt);

      response = await dbFunction.create(models.tbl_user, {
        name: name,
        password: hPassword,
        email_id: email_id,
        designation_id: designation_id,
        mobile_no: mobile_no,
        address: address,
      });

      return res.status(RESPONSE_STATUS.CREATED.CODE).json({
        CODE: RESPONSE_STATUS.CREATED.CODE,
        STATUS: RESPONSE_STATUS.CREATED.STATUS,
        DATA: response,
        MESSAGE: RESPONSE_STATUS.CREATED.MESSAGE,
      });
    } else {
      return res.status(RESPONSE_STATUS.EXIST.CODE).json({
        CODE: RESPONSE_STATUS.EXIST.CODE,
        STATUS: RESPONSE_STATUS.EXIST.STATUS,
        DATA: {},
        MESSAGE: RESPONSE_STATUS.EXIST.MESSAGE,
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

const deleteUser = async (req, res, next) => {
  try {
    const response = await dbFunction.remove(models.tbl_user, {
      where: {
        user_id: { [Op.eq]: req.params.uId },
        designation_id: { [Op.notIn]: [1] },
      },
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

const getUserById = async (req, res, next) => {
  try {
    const response = await dbFunction.findOne(models.tbl_user, {
      where: {
        user_id: req.params.uId,
        designation_id: { [Op.notIn]: [1], [Op.in]: [req.params.uId] },
      },
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

const updateUser = async (req, res, next) => {
  const { name, email_id, designation_id, mobile_no, address } = req.body;
  try {
    await dbFunction.findAndUpdate(
      models.tbl_user,
      { where: { user_id: req.params.uId } },
      {
        name,
        email_id,
        designation_id,
        mobile_no,
        address,
      }
    );
    return res.status(RESPONSE_STATUS.UPDATED.CODE).json({
      CODE: RESPONSE_STATUS.UPDATED.CODE,
      STATUS: RESPONSE_STATUS.UPDATED.STATUS,
      DATA: {},
      MESSAGE: RESPONSE_STATUS.UPDATED.MESSAGE,
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

const updatePassword = async (req, res, next) => {};

module.exports = {
  getUser: getUser,
  createUser: createUser,
  deleteUser: deleteUser,
  getUserById: getUserById,
  updateUser: updateUser,
  updatePassword: updatePassword,
};
