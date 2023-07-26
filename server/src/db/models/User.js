'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // include other fields as per your ERD
  }, {
    // optional: if you want to disable timestamp fields (createdAt, updatedAt)
    timestamps: false
  });

  User.associate = function(models) {
    // define association here if any
    // e.g. User.hasMany(models.Session)
  };

  return User;
};
