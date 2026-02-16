import { sequelize } from "../models/index.js"

await sequelize.drop();
await sequelize.sync();
console.log("🗃️ Structure de la base de données : ", await sequelize.getQueryInterface().showAllTables());
await sequelize.close();

