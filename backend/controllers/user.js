//utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt');

// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require('jsonwebtoken');

//récupère notre model User ,créer avec le schéma mongoose
const User = require('../models/User');

require('dotenv').config();

//création de nouveau utilisateur SIGNUP
exports.signup = (req, res, next) => {
    if (!/^[A-Za-z@&_$0-9\s,'-]{6,30}$/.test(req.body.password)) {
        return res.status(400).json({ message: 'Invalid password -- Minimum 6 letters!'});
    }
    else{
        //HASH du mot de passe avec le bcrypt & (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
             
            //console.log(Buffer.from('Hello World').toString('base64'));
            console.log("Signed in User_id : "+req.body.email);
            
            // Masquage de l'adresse mail
            let buff = Buffer.from(req.body.email);
            let emailInbase64 = buff.toString('base64');
            
            // Création du nouvel utilisateur avec le model mongoose
            const user = new User({
                 // On récupère émail masqué de base64
                email: emailInbase64,
                 // On récupère le mot de passe hashé de bcrypt
                password: hash
            });
            //sauvegarde dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur Créé !'}))
                .catch(error => res.status(409).json({  message: "Désolé l'utilisateur Existe Déja !"}));//Error : Si il existe déjà un utilisateur avec cette adresse email
        })
        .catch(error => res.status(500).json({ error }));
    }  
};

//Création connexion pour les utilisateur déja enregistré LOGIN
exports.login = (req, res, next) => {

    // Masqué de l'adresse mail
    let bufferEmail = Buffer.from(req.body.email).toString('base64');
    
    console.log("Logged in User_id : "+req.body.email);
    //pour trouver l'utilisateur dans la base de donnée qui correspond à l'adresse entrée par l'utilisateur
    User.findOne({ email: bufferEmail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur Non Trouvé ! ' });
            }
             // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de Passe Incorrect ! ' });
                    }
                    // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
                    res.status(200).json({
                        userId: user._id,
                        //créé le token pour sécuriser le compte de l'utilisateur
                        //la fonction "sign" de jsonwebtoken pour encoder un nouveau token
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN,
                            { expiresIn: '24h' }
                        )
                        
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};