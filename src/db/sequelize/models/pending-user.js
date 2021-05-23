const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pending_user', {
    pending_user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    confirmation_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
