import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Dialect } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the correct path to your .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Define the type for the configuration object
interface Config extends SequelizeOptions {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string;
  dialect: Dialect;
}

interface ConfigEnv {
  development: Config;
  test: Config;
  production: Config;
}

export const configJson: ConfigEnv = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql" as Dialect,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql" as Dialect,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql" as Dialect,
  },
};
