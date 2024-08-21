import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Activity, SessionActivity, TrainingSession, User } from "./models";
import { configJson } from "./config/config";

const env = (process.env.NODE_ENV || "development") as keyof typeof configJson;
const config: SequelizeOptions = configJson[env] as SequelizeOptions;

if (!config.database || !config.username || !config.password) {
  throw new Error(
    "Database configuration is incomplete. Please check your environment variables."
  );
}

// Create a Sequelize instance using sequelize-typescript
const sequelize = new Sequelize({
  ...config,
  models: [Activity, SessionActivity, TrainingSession, User],
});

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  Activity: Activity,
  SessionActivity: SessionActivity,
  TrainingSession: TrainingSession,
  User: User,
};

export default db;
