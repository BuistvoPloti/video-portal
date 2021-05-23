const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('video', {
    video_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bucket_file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
