var DataTypes = require("sequelize").DataTypes;
var _tbl_application = require("./tbl_application");
var _tbl_college = require("./tbl_college");
var _tbl_designation = require("./tbl_designation");
var _tbl_history_log = require("./tbl_history_log");
var _tbl_login_log = require("./tbl_login_log");
var _tbl_product = require("./tbl_product");
var _tbl_role = require("./tbl_role");
var _tbl_user = require("./tbl_user");
var _tbl_vehicle = require("./tbl_vehicle");
var _tbl_vehicle_image = require("./tbl_vehicle_image");

function initModels(sequelize) {
  var tbl_application = _tbl_application(sequelize, DataTypes);
  var tbl_college = _tbl_college(sequelize, DataTypes);
  var tbl_designation = _tbl_designation(sequelize, DataTypes);
  var tbl_history_log = _tbl_history_log(sequelize, DataTypes);
  var tbl_login_log = _tbl_login_log(sequelize, DataTypes);
  var tbl_product = _tbl_product(sequelize, DataTypes);
  var tbl_role = _tbl_role(sequelize, DataTypes);
  var tbl_user = _tbl_user(sequelize, DataTypes);
  var tbl_vehicle = _tbl_vehicle(sequelize, DataTypes);
  var tbl_vehicle_image = _tbl_vehicle_image(sequelize, DataTypes);

  tbl_role.belongsTo(tbl_application, { as: "application", foreignKey: "application_id"});
  tbl_application.hasMany(tbl_role, { as: "tbl_roles", foreignKey: "application_id"});
  tbl_role.belongsTo(tbl_designation, { as: "designation", foreignKey: "designation_id"});
  tbl_designation.hasMany(tbl_role, { as: "tbl_roles", foreignKey: "designation_id"});
  tbl_user.belongsTo(tbl_designation, { as: "designation", foreignKey: "designation_id"});
  tbl_designation.hasMany(tbl_user, { as: "tbl_users", foreignKey: "designation_id"});
  tbl_history_log.belongsTo(tbl_login_log, { as: "log", foreignKey: "log_id"});
  tbl_login_log.hasMany(tbl_history_log, { as: "tbl_history_logs", foreignKey: "log_id"});
  tbl_college.belongsTo(tbl_user, { as: "created_by_tbl_user", foreignKey: "created_by"});
  tbl_user.hasMany(tbl_college, { as: "tbl_colleges", foreignKey: "created_by"});
  tbl_college.belongsTo(tbl_user, { as: "updated_by_tbl_user", foreignKey: "updated_by"});
  tbl_user.hasMany(tbl_college, { as: "updated_by_tbl_colleges", foreignKey: "updated_by"});
  tbl_login_log.belongsTo(tbl_user, { as: "user", foreignKey: "user_id"});
  tbl_user.hasMany(tbl_login_log, { as: "tbl_login_logs", foreignKey: "user_id"});
  tbl_product.belongsTo(tbl_user, { as: "created_by_tbl_user", foreignKey: "created_by"});
  tbl_user.hasMany(tbl_product, { as: "tbl_products", foreignKey: "created_by"});
  tbl_product.belongsTo(tbl_user, { as: "updated_by_tbl_user", foreignKey: "updated_by"});
  tbl_user.hasMany(tbl_product, { as: "updated_by_tbl_products", foreignKey: "updated_by"});
  tbl_vehicle.belongsTo(tbl_user, { as: "created_by_tbl_user", foreignKey: "created_by"});
  tbl_user.hasMany(tbl_vehicle, { as: "tbl_vehicles", foreignKey: "created_by"});
  tbl_vehicle.belongsTo(tbl_user, { as: "updated_by_tbl_user", foreignKey: "updated_by"});
  tbl_user.hasMany(tbl_vehicle, { as: "updated_by_tbl_vehicles", foreignKey: "updated_by"});
  tbl_vehicle_image.belongsTo(tbl_vehicle, { as: "vehicle", foreignKey: "vehicle_id"});
  tbl_vehicle.hasMany(tbl_vehicle_image, { as: "tbl_vehicle_images", foreignKey: "vehicle_id"});

  return {
    tbl_application,
    tbl_college,
    tbl_designation,
    tbl_history_log,
    tbl_login_log,
    tbl_product,
    tbl_role,
    tbl_user,
    tbl_vehicle,
    tbl_vehicle_image,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
