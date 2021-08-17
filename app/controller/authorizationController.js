const { sequelize, Sequelize } = require("../models/index");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const RESPONSE_STATUS = require("../common/status-variable");
const common = require("../common/common");

const getApplicationListByDesignation = async (req, res, next) => {
  try {
    let query;
    if (req.userData.user.designation_id === 1) {
      query = "select * from tbl_application";
    } else {
      query =
        ` select *  from(select c.application_id,c.name,c.description,b.deny_data` +
        ` from tbl_user a left join tbl_role b on b.designation_id=a.designation_id` +
        ` left join tbl_application c on c.application_id=b.application_id` +
        ` where a.user_id=${req.userData.user.user_id} and b.deny_data=true) as application_data`;
    }
    const response = await sequelize.query(query);

    common.createHistoryLogs(req, {
      sCode: RESPONSE_STATUS.OK.CODE,
      logMsg: RESPONSE_STATUS.OK.MESSAGE,
    });

    // const responseData = await response.json();
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

module.exports = {
  getApplicationListByDesignation: getApplicationListByDesignation,
};
