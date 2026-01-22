import { db } from "./connection";
import { users } from "./schema";
import { getGeneratedImage } from "../utils/generate-image";
import bcrypt from "bcrypt";
import "dotenv/config";

const seedUsers = async () => {
  const seedersPassword = process.env.SEEDERS_PASSWORD || "";

  if (!seedersPassword) {
    throw new Error("SEEDERS_PASSWORD is missing");
  }

  const hashedPassword = await bcrypt.hash(seedersPassword, 6);

  await db.insert(users).values([
    {
      firstName: "Guy",
      lastName: "Ben David",
      email: "guy@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "David",
      lastName: "De Gea",
      email: "david@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Aaron",
      lastName: "Wan Bissaka",
      email: "aaron@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Harry",
      lastName: "Maguire",
      email: "harry@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Victor",
      lastName: "Lindelof",
      email: "victor@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Luke",
      lastName: "Shaw",
      email: "luke@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Fred",
      lastName: "Rodrigues",
      email: "fred@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Scott",
      lastName: "Mctominay",
      email: "scott@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Nemanja",
      lastName: "Matic",
      email: "nemanja@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Donny",
      lastName: "Van De Beek",
      email: "donny@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Paul",
      lastName: "Pogba",
      email: "paul@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Bruno",
      lastName: "Fernandes",
      email: "bruno@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Marcus",
      lastName: "Rashford",
      email: "marcus@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Mason",
      lastName: "Greenwood",
      email: "mason@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Anthony",
      lastName: "Martial",
      email: "anthony@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Edinson",
      lastName: "Cavani",
      email: "edinson@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Eric",
      lastName: "Bailly",
      email: "eric@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Axel",
      lastName: "Tuanzebe",
      email: "axel@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Brandon",
      lastName: "Williams",
      email: "brandon@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Daniel",
      lastName: "James",
      email: "daniel@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    },
    {
      firstName: "Juan",
      lastName: "Mata",
      email: "juan@gmail.com",
      password: hashedPassword,
      image: getGeneratedImage()
    }
  ]);
};

seedUsers()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
