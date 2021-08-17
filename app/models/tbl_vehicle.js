const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_vehicle', {
    vehicle_id: {
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
    manufacturer: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    vehicle_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fuel_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    colour: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_user',
        key: 'user_id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_user',
        key: 'user_id'
      }
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_vehicle',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_vehicle_pkey",
        unique: true,
        fields: [
          { name: "vehicle_id" },
        ]
      },
    ]
  });
};
