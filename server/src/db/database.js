import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import configJson from "./config/config.js";

const basename = path.basename(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || "development";
const config = configJson.config[env];
const db = {};

console.log(config);
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Import all models dynamically
const modelsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "models"
);

const files = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

await Promise.all(
  files.map(async (file) => {
    const modelModule = await import(path.join(modelsDir, file));
    const model = modelModule.default; // Depending on how the model is exported
    db[model.name] = model(sequelize, Sequelize.DataTypes);
  })
);

// Associate models if needed
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default { ...db };
