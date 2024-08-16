const User = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      auth0id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      first: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.TrainingSession);
  };

  return User;
};

export default User;
