const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_history_log', {
    tbl_history_log_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    apis: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    log_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_login_log',
        key: 'log_id'
      }
    },
    response_status_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    res_message: {
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
    tableName: 'tbl_history_log',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tbl_history_log_pkey",
        unique: true,
        fields: [
          { name: "tbl_history_log_id" },
        ]
      },
    ]
  });
};
