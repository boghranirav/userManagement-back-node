const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_role', {
    role_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    designation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_designation',
        key: 'designation_id'
      }
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_application',
        key: 'application_id'
      }
    },
    read_data: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    create_data: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    update_data: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    delete_data: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deny_data: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_role',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_role_pkey",
        unique: true,
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
};
