const nodemailer = require('nodemailer');
const config = require('../config/config');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: false
        });
    }

    async sendNewUserCredentials(email, password) {
        const mailOptions = {
            from: 'noreply@mymood.fr',
            to: email,
            subject: 'Vos identifiants MyMood',
            html: `
                <h1>Bienvenue sur MyMood</h1>
                <p>Voici vos identifiants de connexion :</p>
                <p>Email : ${email}</p>
                <p>Mot de passe : ${password}</p>
                <p>Nous vous recommandons de changer votre mot de passe lors de votre première connexion sur <a href="http://localhost:5500">MyMood</a></p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendAlertNotification(studentInfo, supervisors) {
        const mailPromises = supervisors.map(supervisor => {
            const mailOptions = {
                from: 'noreply@mymood.fr',
                to: supervisor.email,
                subject: 'Alerte MyMood - Stagiaire en difficulté',
                html: `
                    <h1>Alerte MyMood</h1>
                    <p>Le stagiaire ${studentInfo.prenom} ${studentInfo.nom} a déclenché une alerte.</p>
                    <p>Veuillez prendre contact avec l'étudiant pour lui apporter votre soutien.</p>
                    <p>Email du stagaire : ${studentInfo.email}</p>
                    <p>Humeur actuel : ${studentInfo.score}/100</p>
                `
            };
            return this.transporter.sendMail(mailOptions);
        });

        return Promise.all(mailPromises);
    }
}

module.exports = new MailService();