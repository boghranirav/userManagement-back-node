const dbFunction = require("../common/db-function");
const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const bcrypt = require("bcrypt");
const common = require("../common/common");
const RESPONSE_MSG = require("../common/status-variable");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const userLogin = async (req, res, next) => {
  const { email_id, password, browser, ip_address, os } = req.body;

  if (!(email_id && password)) {
    await common.createLog({
      browser,
      ip_address,
      os,
      log_status: "Empty Data.",
    });
    return res
      .status(RESPONSE_MSG.EMPTY_DATA.CODE)
      .send(RESPONSE_MSG.EMPTY_DATA);
  }

  let existingUser;
  try {
    existingUser = await dbFunction.findOne(models.tbl_user, {
      where: { email_id: email_id },
    });

    if (!existingUser) {
      await common.createLog({
        browser,
        ip_address,
        os,
        log_status: "Invalid user id.",
      });
      return res
        .status(RESPONSE_MSG.NOT_FOUND.CODE)
        .json(RESPONSE_MSG.NOT_FOUND);
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      await common.createLog({
        browser,
        ip_address,
        os,
        log_status: err.message,
      });
      return res
        .status(RESPONSE_MSG.INTERNAL_SERVER_ERROR.CODE)
        .json(RESPONSE_MSG.INTERNAL_SERVER_ERROR);
    }

    if (!isValidPassword) {
      await common.createLog({
        user_id: existingUser.user_id,
        browser,
        ip_address,
        os,
        log_status: "Invalid Password.",
      });
      return res
        .status(RESPONSE_MSG.INVALID_LOGIN.CODE)
        .json(RESPONSE_MSG.INVALID_LOGIN);
    }

    const createLogId = await common.createLog({
      user_id: existingUser.user_id,
      browser,
      ip_address,
      os,
      log_status: "OK",
    });

    const jwtString = common.jwtEncode({
      user_id: existingUser.user_id,
      email_id,
      designation_id: existingUser.designation_id,
      log_id: createLogId.dataValues.log_id,
    });

    return res.status(RESPONSE_MSG.OK.CODE).json({
      success: true,
      token: jwtString,
      message: "Ok.",
    });
  } catch (err) {
    await common.createLog({
      browser,
      ip_address,
      os,
      log_status: err.message,
    });
    return res
      .status(RESPONSE_MSG.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_MSG.INTERNAL_SERVER_ERROR);
  }
};

const userGoogleLogin = async (req, res, next) => {
  const { token, browser, ip_address, os } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email } = ticket.getPayload();

  let existingUser;
  try {
    existingUser = await dbFunction.findOne(models.tbl_user, {
      where: { email_id: email },
    });

    if (!existingUser) {
      await common.createLog({
        browser,
        ip_address,
        os,
        log_status: "Invalid user id.",
      });
      return res
        .status(RESPONSE_MSG.NOT_FOUND.CODE)
        .json(RESPONSE_MSG.NOT_FOUND);
    }

    const createLogId = await common.createLog({
      user_id: existingUser.user_id,
      browser,
      ip_address,
      os,
      log_status: "OK",
    });

    const jwtString = common.jwtEncode({
      user_id: existingUser.user_id,
      email_id: email,
      designation_id: existingUser.designation_id,
      log_id: createLogId.dataValues.log_id,
    });

    return res.status(RESPONSE_MSG.OK.CODE).json({
      success: true,
      token: jwtString,
      message: "Ok.",
    });
  } catch (error) {
    await common.createLog({
      browser,
      ip_address,
      os,
      log_status: error.message,
    });
    return res
      .status(RESPONSE_MSG.INTERNAL_SERVER_ERROR.CODE)
      .json(RESPONSE_MSG.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  userLogin: userLogin,
  userGoogleLogin: userGoogleLogin,
};
