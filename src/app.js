const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// Middleware
const authMiddleware = require('./middlewares/authenticate');


const app = express();

// Middleware pour activer CORS, parsing JSON et Swagger
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour récupérer les informations du client
app.use((req, res, next) => {
    req.clientInfo = {
        ip: req.headers['x-forwarded-for'] || req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || req.headers['referrer']
    };
    next();
});


// // Middleware pour les erreurs 404
// app.use((req, res) => res.status(404).json({ error: 'Ressource non trouvée' }));

// Middleware pour les erreurs serveur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Création du serveur HTTP
const server = http.createServer(app);

// Routes
app.use('/api', authMiddleware);
app.use('/', authRoutes);
// app.use('/api/admin', adminRoutes);

// Export des modules nécessaires pour les tests ou l'extension
module.exports = { app, server };
