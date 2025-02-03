const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API MyMood',
            version: '1.0.0',
            description: 'API pour la gestion des humeurs avec Node.js, Express et SQLite',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: `Serveur de développement de l'API`
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Mood: {
                    type: 'object',
                    properties: {
                        id_mood: { type: 'integer' },
                        id_user: { type: 'integer' },
                        score: { type: 'integer' },
                        en_alerte: { type: 'boolean' },
                        update_date: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js'], // Indique où Swagger doit trouver les routes documentées
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;
