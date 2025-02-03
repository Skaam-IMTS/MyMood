require('dotenv').config();

module.exports = {
    server: {
        port: process.env.PORT || 3000
    },
    database: {
        path: process.env.DB_PATH || './database/data/mymood.db'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_secret_key',
        expiresIn: process.env.JWT_EXPIRES || '1d'
    },
    mail: {
        host: process.env.SMTP_HOST || 'maildev',
        port: process.env.SMTP_PORT || 1025
    }
};