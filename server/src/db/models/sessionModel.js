'use strict';

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
  }, {
    // optional: if you want to disable timestamp fields (createdAt, updatedAt)
    timestamps: true,
  });

  Session.associate = function(models) {
    // define association here if any
    Session.belongsTo(models.User);
    Session.hasMany(models.SessionActivity, { foreignKey: 'sessionId' });
  };

  return Session;
};
