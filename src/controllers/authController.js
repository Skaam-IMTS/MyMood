const AuthService = require('../services/AuthService');

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const auth = await AuthService.login(email, password);
            res.json(auth);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = AuthController;