import 'dotenv/config';
import express from "express"; 
import PokemonRoutes from "./routes/pokemon.routes.js"; 
import TeamRoutes from "./routes/team.routes.js"; 
import TypeRoutes from "./routes/type.route.js"; 
import { sequelize } from "./models/index.js";
import authRouter from "./routes/auth.routes.js"; 
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";


const app = express(); 

const port = process.env.PORT || 3001 

app.use(express.json()); 

await sequelize.sync({ alter: true });
console.log("Base de données synchronisée");

app.use('/pokemon', PokemonRoutes); 
app.use ('/team', TeamRoutes); 
app.use('/type', TypeRoutes)
app.use('/api/auth', authRouter); 

// Route pour la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log(`L'application tourne sur le port : http://localhost:${port}`);
});
