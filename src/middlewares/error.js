require('dotenv').config();

// Custom Error class
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Gestion des erreurs spécifiques
    if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({
            status: 'fail',
            message: 'Contrainte de base de données violée'
        });
    }

    // Réponse générique
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    AppError,
    errorHandler
};