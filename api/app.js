import 'dotenv/config';
import express from "express"; 
import PokemonRoutes from "./routes/pokemon.routes.js"; 
import TeamRoutes from "./routes/team.routes.js"; 
import { sequelize } from "./models/index.js";


const app = express(); 

const port = process.env.PORT || 3001 

app.use(express.json()); 

await sequelize.sync({ alter: true });
console.log("Base de données synchronisée");

app.use('/pokemon', PokemonRoutes); 
app.use ('/team', TeamRoutes); 

app.listen(port, () => {
    console.log(`L'application tourne sur le port : http://localhost:${port}`);
});
