'use strict';

module.exports = (sequelize, DataTypes) => {
  const SessionActivity = sequelize.define('SessionActivity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fingerIntensity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    upperIntensity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lowerIntensity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  }, {
    // optional: if you want to disable timestamp fields (createdAt, updatedAt)
    timestamps: true,
  });

  SessionActivity.associate = function(models) {
    // define association here if any
    SessionActivity.belongsTo(models.Session);
    SessionActivity.belongsTo(models.Activity);
  };

  return SessionActivity;
};
