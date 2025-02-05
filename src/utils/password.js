const passGenerator = require('generate-password');
const bcrypt = require('bcryptjs');

class PasswordHandler {
    static generatePassword() {
        return passGenerator.generate({
            length: 8,
            numbers: true,
            uppercase: true,
            lowercase: true,
            excludeSimilarCharacters: true,
        });
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    static async comparePasswords(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = PasswordHandler;