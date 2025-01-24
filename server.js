const { app, server } = require('./src/app');
const PORT = process.env.PORT || 3000;

// Démarrage du serveur HTTP
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
