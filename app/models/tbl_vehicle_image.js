const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_vehicle_image', {
    image_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_vehicle',
        key: 'vehicle_id'
      }
    },
    image_path: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_vehicle_image',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_vehicle_image_pkey",
        unique: true,
        fields: [
          { name: "image_id" },
        ]
      },
    ]
  });
};
