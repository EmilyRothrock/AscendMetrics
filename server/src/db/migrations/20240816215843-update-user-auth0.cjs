"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "passwordSalt");
    await queryInterface.removeColumn("Users", "passwordHash");
    await queryInterface.addColumn("Users", "auth0id", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "passwordSalt", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "passwordHash", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("Users", "auth0id");
  },
};
