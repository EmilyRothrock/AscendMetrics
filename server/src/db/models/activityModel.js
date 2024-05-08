'use strict';

module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TINYTEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    // optional: if you want to disable timestamp fields (createdAt, updatedAt)
    timestamps: true,
  });

  Activity.associate = function(models) {
    // define association here if any
    Activity.hasMany(models.SessionActivity);
  };

  return Activity;
};
