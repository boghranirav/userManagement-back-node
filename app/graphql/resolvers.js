const { sequelize, Sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");
const init_models = require("../models/init-models");
const models = init_models(sequelize, Sequelize);
const dbFunction = require("../common/db-function");
const validator = require("validator");

module.exports = {
  createApplication: async function ({ userInput }, req) {
    console.log("abc");
    const errors = [];
    if (validator.isEmpty(userInput.name.trim())) {
      errors.push({ message: "Application name empty!" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    await dbFunction.create(models.tbl_application, {
      name: userInput.name.trim(),
      description: userInput.description.trim(),
    });

    const val = await sequelize.query(
      "select name, description from tbl_application where application_id=(select max(application_id) from tbl_application) ",
      { type: QueryTypes.SELECT }
    );
    console.log(val[0]);
    return val[0];
  },
};
