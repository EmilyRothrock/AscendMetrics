module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('SessionActivities', 'startTime', {
      type: Sequelize.TIME,
      allowNull: false // set based on your requirement
    });
    await queryInterface.changeColumn('SessionActivities', 'endTime', {
      type: Sequelize.TIME,
      allowNull: false // set based on your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('SessionActivities', 'startTime', {
      type: Sequelize.DATE,
      allowNull: false // set based on your initial setup
    });
    await queryInterface.changeColumn('SessionActivities', 'endTime', {
      type: Sequelize.DATE,
      allowNull: false // set based on your initial setup
    });
  }
};
