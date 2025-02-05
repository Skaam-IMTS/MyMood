const { AppError } = require("../middlewares/error");
const User = require("../models/User");

class UserController {
  static async getProfile(req, res, next) {
      try {
          const user = await User.findByEmail(req.user.email);
          if (!user) {
              throw new AppError(404, "Utilisateur introuvable");
          }
          res.json({
              email: user.email,
              nom: user.nom,
              prenom: user.prenom
          });
      } catch(err) {
          next(err);
      }
  }
  
  static async updateProfile(req, res, next) {
    try {
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        throw new AppError(404, "Utilisateur introuvable");
      }
      await user.updateProfile(req.body);
      res.json({message: "Profil mis à jour"});
    } catch(err) {
      next(err);
    }
  }
}

module.exports = UserController;