const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_login_log', {
    log_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_user',
        key: 'user_id'
      }
    },
    browser: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    os: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    log_status: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'tbl_login_log',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_login_log_pkey",
        unique: true,
        fields: [
          { name: "log_id" },
        ]
      },
    ]
  });
};
