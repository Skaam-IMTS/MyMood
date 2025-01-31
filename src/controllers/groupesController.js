const db = require('../../database/database');

// groupes
exports.groupes = (req, res) => {
    db.all(`SELECT * FROM groupe`, (err, rows) => {
        
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ message: "Erreur de base de données" });
        }

        if (!rows || rows.length === 0) {
            return res.json({ message: 'Pas de groupe trouvé' });
        }
        res.json(rows);
    });
};

exports.groupeAjout = (req, res) => {
    console.log(req.body);
      const { nom_groupe } = req.body;
      db.run(`INSERT INTO groupe (nom_groupe)
          VALUES (?);`, [nom_groupe],  function (err) {
              
              if (err || this.changes == 0) {
                return res.status(400).json({message:'Erreur lors de l\'ajout'}) 
              }
              res.status(200).json({message:"ok"}
  
      )});
  };

exports.groupeSuppression =(req, res) =>{
    const nom_groupe = req.body.nom_groupe
    db.run(`DELETE FROM groupe WHERE nom_groupe = ?`, [nom_groupe], function (err) {
      console.log(this);
      
      if (err || this.changes == 0) {
        return res.status(400).json({message:'Erreur lors de la supression'}) 
      }
      res.status(200).json({message:"ok"})})
};

// inscription a un groupe
exports.inscription = (req, res) => {
    db.all(`SELECT * FROM inscription`, (err, rows) => {
        
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ message: "Erreur de base de données" });
        }
  
        if (!rows || rows.length === 0) {
            return res.json({ message: 'Pas d\'inscription trouvé' });
        }
  
        console.log(rows);
        res.json(rows);
    });
};

exports.inscriptionAjout = (req, res) => {
    const { est_responsable, nomGroupe, emailUser } = req.body;
    db.run(`INSERT INTO inscription (id_groupe, id_user, est_responsable)
            SELECT 
                g.id_groupe,
                u.id_user,
                ? 
            FROM 
                groupe g
            JOIN 
                user u
            ON 
                g.nom = ? AND u.email = ?;`, [est_responsable, nomGroupe, emailUser],  function (err) {
            console.log(this);
            
            if (err || this.changes == 0) {
              return res.status(400).json({message:'Erreur lors de l\'assignation'})
            }
            return res.status(200).json({message : req.body.nomUser + "est dans le groupe" + req.body.nomGroupe});
        }
    )
};

exports.inscriptionUserSuppression = (req, res) =>{
    const nomUser = req.body.nomUser
    db.run(`DELETE FROM Inscription WHERE id_user = (SELECT id_user FROM user WHERE nom = ?);`, [nomUser], function (err) {
      console.log(this);
      
      if (err || this.changes == 0) {
        return res.status(400).json({message:'Erreur lors de la supression'}) 
      }
      res.status(200).json({message:"ok"})})
};

exports.inscriptionUserAjout = (req, res) =>{
    const { email, nom_groupe } = req.body;
    db.run(`INSERT INTO inscription (id_user, id_groupe)
        SELECT id_user, id_groupe
        FROM user
        JOIN groupe
        ON email = ? and nom_groupe = ?;`, [id_user, id_groupe],  function (err) {
            console.log(this);
            
            if (err || this.changes == 0) {
              return res.status(400).json({message:'Erreur lors de l\'ajout'});
            }
            res.status(200).json({message:"ok"});
        }
    )
};
