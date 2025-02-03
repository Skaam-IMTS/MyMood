const app = require('./src/app');
const PORT = process.env.PORT || 3000;

// Démarrage du serveur HTTP
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

