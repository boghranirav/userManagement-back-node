const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_designation', {
    designation_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_designation',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_designation_pkey",
        unique: true,
        fields: [
          { name: "designation_id" },
        ]
      },
    ]
  });
};
