// eslint-disable-next-line
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("emails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "sender",
        references: {
          key: "email",
          model: "users"
        }
      },
      recipient: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "recipient",
        references: {
          key: "email",
          model: "users"
        }
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at"
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("emails");
  }
};