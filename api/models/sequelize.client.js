import "dotenv/config";
import { sequelize } from "sequelize";

export const sequelize = new sequelize(process.env.PG_URL, {
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  logging: false
});

await sequelize.authenticate();