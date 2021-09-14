// On récupère le package jsonwebtoken
const jwt = require('jsonwebtoken');
require('dotenv').config();

//validation userId en comparison avec le token
module.exports = (req, res, next) => {
    try {
        // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau
        const token = req.headers.authorization.split(' ')[1];
        if (token === undefined) throw new Error('The given token is undefined, authorization denied')
    
        // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé initialement
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN);

        // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
        const userId = decodedToken.userId;
        console.log("decoded token user id  " + userId );
        console.log("req.body.userId Auth : "+req.body.userId);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid User Id';// si le token ne correspond pas au userId : erreur
        }
        else{
            req.body.userId=userId;
            next();// si tout est valide on passe au prochain middleware
        }
    }
    catch{
        res.status(401).json({
            error: new Error('Invalid Request !')
        });
    }
};