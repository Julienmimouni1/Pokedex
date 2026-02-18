import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokédex API',
      version: '1.0.0',
      description: 'Une API pour gérer des Pokémons et des équipes, créée avec Express et Sequelize.',
      contact: {
        name: 'Support API',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Indique ici les fichiers contenant les annotations @swagger
  apis: ['./routes/*.js'], 
};

export const specs = swaggerJsdoc(options);
