const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middlewares/error');
// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Middleware pour activer CORS, parsing JSON et Swagger
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(path.join(__dirname, '.../public')));

app.use('/', authRoutes);
app.use('/mood', moodRoutes);
app.use('/user', userRoutes);
app.use('/groups', groupRoutes);
app.use('/admin', adminRoutes);

// Middleware pour récupérer les informations du client
app.use((req, res, next) => {
    req.clientInfo = {
        ip: req.headers['x-forwarded-for'] || req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || req.headers['referrer']
    };
    next();
});

// Middleware pour les erreurs 404
app.use((req, res, next) => {
    const err = new Error('Ressource non trouvée');
    err.statusCode = 404;
    next(err);
});

// Middleware de gestion d'erreur
app.use(errorHandler);

module.exports = app;
