const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_product', {
    product_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_user',
        key: 'user_id'
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    manufacturer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'tbl_product',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_product_pkey",
        unique: true,
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
