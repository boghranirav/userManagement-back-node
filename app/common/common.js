const jwt = require("jsonwebtoken");
const dbFunction = require("./db-function");
var db = require("../models/index");
var init_models = require("../models/init-models");
var models = init_models(db.sequelize, db.Sequelize);
const RESPONSE_STATUS = require("./status-variable");

//const HttpError = require("../models/http-error");

const generateRandomString = () => {
  var result = "";
  var characters =
    "!@#$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%^&";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const constant = {
  FOUND: 1,
  NOT_FOUND: 2,
  CREATED: 3,
  NOT_CREATED: 4,
};

const jwtEncode = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
  } catch (err) {
    // const error = new HttpError(err.message, 500);
    return err;
  }
};

const jwtDecode = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (!req.headers.authorization || !req.headers.application_id) {
      throw new Error("Authentication failed!");
    }
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    const applicationId = req.headers.application_id;
    let navigation_bar;
    if (!token && !applicationId) {
      throw new Error("Authentication failed!");
    }
    if (req.headers.navigation_bar) {
      navigation_bar = req.headers.navigation_bar;
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, d) => {
      if (
        err === null ||
        err === undefined ||
        err.name === "TokenExpiredError"
      ) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
          ignoreExpiration: true,
        });
        if (Date.now() <= decodedToken.exp * 1000) {
          req.userData = {
            user_id: decodedToken.user_id,
            log_id: decodedToken.log_id,
            designation_id: decodedToken.designation_id,
          };

          const checkUser = await models.tbl_user.findOne({
            where: { user_id: decodedToken.user_id },
          });
          //&& checkUser.designation_id !== 1
          if (checkUser && checkUser.designation_id) {
            let tf = false;

            if (navigation_bar === "1") {
              tf = true;
            } else {
              tf = await checkUserAuth(
                req.method,
                checkUser.designation_id,
                applicationId
              );
            }
            if (tf) {
              req.userData = { user: decodedToken, status: constant.FOUND };
              next();
            } else {
              createHistoryLogs(req, {
                sCode: RESPONSE_STATUS.UNAUTHORISED.CODE,
                logMsg: RESPONSE_STATUS.UNAUTHORISED.MESSAGE,
              });
              return res
                .status(RESPONSE_STATUS.UNAUTHORISED.CODE)
                .json(RESPONSE_STATUS.UNAUTHORISED.MESSAGE);
            }
          } else {
            createHistoryLogs(req, {
              sCode: RESPONSE_STATUS.AUTH_FAIL.CODE,
              logMsg: RESPONSE_STATUS.AUTH_FAIL.MESSAGE,
            });
            return res
              .status(RESPONSE_STATUS.AUTH_FAIL.CODE)
              .json(RESPONSE_STATUS.AUTH_FAIL.MESSAGE);
          }
        } else {
          createHistoryLogs(req, {
            sCode: RESPONSE_STATUS.TOKEN_EXPIRE.CODE,
            logMsg: RESPONSE_STATUS.TOKEN_EXPIRE.MESSAGE,
          });
          return res
            .status(RESPONSE_STATUS.TOKEN_EXPIRE.CODE)
            .json(RESPONSE_STATUS.TOKEN_EXPIRE.MESSAGE);
        }
      } else {
        await createLog({
          browser: req.body && req.body.browser ? req.body.browser : "",
          ip_address:
            req.body && req.body.ip_address ? req.body.ip_address : "",
          os: req.body && req.body.os ? req.body.os : "",
          log_status: err && err.message ? err.message : "Token Error.",
        });
        return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
          MESSAGE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
          error: err.message,
        });
      }
    });
  } catch (err) {
    await createLog({
      browser: req.body && req.body.browser ? req.body.browser : "",
      ip_address: req.body && req.body.ip_address ? req.body.ip_address : "",
      os: req.body && req.body.os ? req.body.os : "",
      log_status: err.message,
    });
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      MESSAGE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

const checkUserAuth = async (rMethod, designationId, application_id) => {
  if (designationId === 1) {
    return true;
  } else {
    const getRole = await dbFunction.findOne(models.tbl_role, {
      where: { designation_id: designationId, application_id: application_id },
    });

    if (getRole === null) {
      return false;
    }
    if (!getRole && !getRole.deny_data) {
      return false;
    }
    if (rMethod === "GET" && getRole.read_data) {
      return true;
    } else if (rMethod === "POST" && getRole.create_data) {
      return true;
    } else if (rMethod === "PATCH" && getRole.update_data) {
      return true;
    } else if (rMethod === "DELETE" && getRole.delete_data) {
      return true;
    } else {
      return false;
    }
  }
};

const createHistoryLogs = async (req, data) => {
  try {
    const createHistoryLogs = await models.tbl_history_log.create({
      apis: `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
      log_id: req.userData.log_id
        ? req.userData.log_id
        : req.userData.user.log_id,
      response_status_code: data.sCode,
      res_message: data.logMsg,
    });
    if (createHistoryLogs) {
      return { data: createHistoryLogs, status: constant.CREATED };
    } else {
      return { data: null, status: constant.NOT_CREATED };
    }
  } catch (err) {
    return { data: null, status: constant.NOT_CREATED, error: err.message };
  }
};

const createLog = async (logData) => {
  try {
    return await dbFunction.create(models.tbl_login_log, logData);
  } catch (error) {
    return res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
      MESSAGE: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      ERROR: error.message,
    });
  }
};

function GetUserNameFromDate() {
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();

  var seconds = d.getSeconds();
  var minutes = d.getMinutes();
  var hour = d.getHours();

  var milisec = d.getMilliseconds();

  return (
    curr_year.toString() +
    curr_month.toString() +
    curr_date.toString() +
    hour.toString() +
    minutes.toString() +
    seconds.toString() +
    milisec.toString()
  );
}

module.exports = {
  generateRandomString,
  constant,
  jwtEncode,
  jwtDecode,
  createLog: createLog,
  createHistoryLogs: createHistoryLogs,
  GetUserNameFromDate: GetUserNameFromDate,
};
