const bcrypt = require("bcrypt");
const generateImage = require("../../utils/generate-image.ts");
require("dotenv").config();

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const hasedPassword = await bcrypt.hash(process.env.SEEDERS_PASSWORD, 6);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Guy",
          last_name: "Ben David",
          email: "guy@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "David",
          last_name: "De Gea",
          email: "david@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Aaron",
          last_name: "Wan Bissaka",
          email: "aaron@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Harry",
          last_name: "Maguire",
          email: "harry@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Victor",
          last_name: "Lindelof",
          email: "victor@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Luke",
          last_name: "Shaw",
          email: "luke@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Fred",
          last_name: "Rodrigues",
          email: "fred@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Scott",
          last_name: "Mctominay",
          email: "scott@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Nemanja",
          last_name: "Matic",
          email: "nemanja@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Donny",
          last_name: "Van De Beek",
          email: "donny@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Paul",
          last_name: "Pogba",
          email: "paul@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Bruno",
          last_name: "Fernandes",
          email: "bruno@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Marcus",
          last_name: "Rashford",
          email: "marcus@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Mason",
          last_name: "Greenwood",
          email: "mason@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Anthony",
          last_name: "Martial",
          email: "anthony@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Edinson",
          last_name: "Cavani",
          email: "edinson@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Eric",
          last_name: "Bailly",
          email: "eric@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Axel",
          last_name: "Tuanzebe",
          email: "axel@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Brandon",
          last_name: "Williams",
          email: "brandon@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Daniel",
          last_name: "James",
          email: "daniel@gmail.com",
          password: hasedPassword,
          image: generateImage()
        },
        {
          first_name: "Juan",
          last_name: "Mata",
          email: "juan@gmail.com",
          password: hasedPassword,
          image: generateImage()
        }
      ],
      {}
    );
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  }
};
