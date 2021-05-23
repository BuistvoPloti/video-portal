const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    two_factor_authentication_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['password', 'salt', 'two_factor_authentication_code'] },
    },
    scopes: {
      unsafe: {
        attributes: { include: ['password', 'salt', 'two_factor_authentication_code'] },
      },
      with2faCode: {
        attributes: { include: ['two_factor_authentication_code'] },
      }
    }
  });
};
