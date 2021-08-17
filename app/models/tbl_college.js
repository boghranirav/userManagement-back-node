const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_college', {
    college_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mobile_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    brochure: {
      type: DataTypes.TEXT,
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
    tableName: 'tbl_college',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_collage_pkey",
        unique: true,
        fields: [
          { name: "college_id" },
        ]
      },
    ]
  });
};
