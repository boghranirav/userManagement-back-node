const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_application', {
    application_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "application_name_unique"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_application',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "application_name_unique",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "tbl_application_pkey",
        unique: true,
        fields: [
          { name: "application_id" },
        ]
      },
    ]
  });
};
