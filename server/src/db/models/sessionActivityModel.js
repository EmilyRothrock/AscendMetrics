const SessionActivity = (sequelize, DataTypes) => {
  const SessionActivity = sequelize.define(
    "SessionActivity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      fingerIntensity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      upperIntensity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lowerIntensity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  SessionActivity.associate = function (models) {
    SessionActivity.belongsTo(models.TrainingSession);
    SessionActivity.belongsTo(models.Activity);
  };

  return SessionActivity;
};

export default SessionActivity;
