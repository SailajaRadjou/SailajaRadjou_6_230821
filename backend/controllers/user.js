const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

//création de nouveau utilisateur SIGNUP
exports.signup = (req, res, next) => {
    //HASH du mot de passe avec le bcrypt
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //sauvegarde dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur Créé !'}))
                .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error }));
};

//Création connexion pour les utilisateur déja enregistré LOGIN
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur Non Trouvé ! ' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de Passe Incorrect ! ' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        //créé le token pour sécuriser le compte de l'utilisateur
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};