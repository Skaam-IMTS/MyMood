const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/jwt');
const { getUserByEmail } = require('../models/userModel');

/**
     * Log in a user with a email and password.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<Object>} - A promise that resolves to an object containing a JWT token.
     * @throws {Error} - If the login fails.
     
*/
exports.login = async (req, res) =>{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez renseigner tous les champs' });
    }

    try {
        const user = await getUserByEmail(email);
        if (!user ||!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ 
                message: 'Identifiants incorrect' }); 
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).json({
            message : "Connexion réussie",
            token : token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Erreur lors de la connexion",
            error: error.message }); 
    }
}