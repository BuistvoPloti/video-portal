const applySetup = (sequelize) => {
  const { user, video, pending_user } = sequelize.models;

  user.hasMany(video);
  video.belongsTo(user, {
    foreignKey: 'user_id',
  });
  pending_user.belongsTo(user, {
    foreignKey: 'user_id',
    allowNull: true,
    onDelete: 'cascade'
  });
};

module.exports = { applySetup };
