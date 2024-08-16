const TrainingSession = (sequelize, DataTypes) => {
  const TrainingSession = sequelize.define(
    "TrainingSession",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      completedOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT("tiny"),
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  TrainingSession.associate = function (models) {
    TrainingSession.belongsTo(models.User);
    TrainingSession.hasMany(models.SessionActivity);
  };

  return TrainingSession;
};

export default TrainingSession;
