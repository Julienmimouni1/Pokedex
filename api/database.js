// import "dotenv/config";
// import { Sequelize } from "sequelize";

// console.log("1. Initialisation de Sequelize...");

// export const sequelize = new Sequelize(process.env.PG_URL, {
//   define: {
//     underscored: true,
//   },

//   logging: console.log 
// });

// export async function testConnection() {
//   try {
//     console.log("2. Tentative de connexion à PostgreSQL...");
//     await sequelize.authenticate();
//     console.log("3. ✅ Connexion réussie !");
//   } catch (error) {
//     console.error("3. ❌ Connexion échouée :", error.message);
//   } finally {
//     await sequelize.close();
//     console.log("4. Connexion refermée.");
//   }
// }

// testConnection();