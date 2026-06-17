import 'dotenv/config';
import express from "express"; 
import PokemonRoutes from "./routes/pokemon.routes.js"; 
import TeamRoutes from "./routes/team.routes.js"; 
import TypeRoutes from "./routes/type.route.js"; 
import { sequelize } from "./models/index.js";
import authRouter from "./routes/auth.routes.js"; 
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";
import { xss } from 'express-xss-sanitizer';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';


const app = express(); 

const port = process.env.PORT || 3001 

app.use(express.json()); 
app.use(xss()); 
app.use(cors()); 
app.use(cookieParser());

// Fonction de connexion avec tentatives multiples (Retry Pattern)
const connectWithRetry = async () => {
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            await sequelize.sync({ alter: true });
            console.log("Base de données synchronisée");
            return; // Sortie de la fonction si succès
        } catch (err) {
            console.log(`Tentative de connexion échouée (${i + 1}/${maxRetries})... Nouvelle tentative dans 5s.`);
            await new Promise(res => setTimeout(res, 5000)); // Attendre 5 secondes
        }
    }
    console.error("Impossible de se connecter à la BDD après plusieurs tentatives.");
};

await connectWithRetry();

app.use('/pokemon', PokemonRoutes); 
app.use ('/team', TeamRoutes); 
app.use('/type', TypeRoutes)
app.use('/api/auth', authRouter); 

// Route pour la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app ; 