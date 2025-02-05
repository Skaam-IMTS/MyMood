const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const PasswordHandler = require('../utils/password');

class AuthService {
    static async login(email, password) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const validPassword = await PasswordHandler.comparePasswords(password, user.password);
        if (!validPassword) {
            throw new Error('Mot de passe incorrect');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        return { token, user: { 
            email: user.email,
            role: user.role, // 'admin', 'superviseur' ou 'stagiaire'
        }};
    }
}

module.exports = AuthService;