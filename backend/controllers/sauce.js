const Sauce = require('../models/Sauce');
// Récupération du module 'file system' de Node 
//permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');

//créé une nouvelle sauce POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id généré automatiquement et envoyé par le front-end.
    // L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    delete sauceObject._id;

    const sauce = new Sauce({
     ...sauceObject,
     //création de URL d'image
     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //Enregistrement de l'objet Sauce dans la base de donnée
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce Enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

//lecture de toutes les sauces dans la DB GET
exports.getAllSauces = (req, res, next) => {
    //On utilise la méthode find() pour obtenir la liste complète des sauces trouvées dans la base de donnée
    Sauce.find()
      .then( sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
}

//lecture une sauce avec son Id GET/:id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

//modification d'une Sauce PUT
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /images
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // une fois que l'ancienne image est supprimée dans le dossier /images, on peut mettre à jour le reste
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`                        
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée avec succes!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée avec succes!' }))
            .catch(error => res.status(400).json({ error }));
    }
}

//Supprimer une sauce DELETE
exports.deleteSauce = (req, res, next) => {
    //recupéré id de sauce depuis URL
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        //récupération du nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];

        //pour supprimer l'image dans le fichier UNLINK
        fs.unlink(`images/${filename}`, () => {
            //supprime le sauce dans le database
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce Supprimé !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));    
}

//LIKE ou DISLIKE
exports.likeDislikeSauce = (req, res, next) => {
    
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    console.log("USER_ID : "+userId+"  SAUCE_ID -- "  + sauceId +"  LIKES "+like);
        
    switch (like) {

        //il s'agit un LIKE
        case 1 :
            //L'opérateur $push ajoute une valeur spécifiée à un tableau. Ici on ajoute l'utilisateur dans le tableau usersLiked
            //L'opérateur $inc incrémente un champ d'une valeur spécifiée
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
                .then(() => res.status(200).json({ message: "J'aime" }))
                .catch((error) => res.status(400).json({ error }))
            break;
      
        //il s'agit annuler un LIKE ou DISLIKE   
        case 0 :
            Sauce.findOne({ _id: sauceId })
            
            .then((sauce) => {
                console.log('\n'+ "sauce : "+sauce);
                //Annulation LIKE
                //la méthode includes() détermine si une chaîne contient ou non les caractères donnés.
                //Cette méthode renvoie true si la chaîne contient les caractères, sinon elle renvoie false.
                //ici on cherche si l'utilisateur est déjà dans le tableau usersLiked
                if (sauce.usersLiked.includes(userId)) { 
                    //L'opérateur $pull supprime de valeurs d'un tableau , ici on retire l'utilisateur du tableau.
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                      .then(() => res.status(200).json({ message: 'Like supprimé !' }))
                      .catch((error) => res.status(400).json({ error }))
                }
                //Annulation DISLIKE
                //ici on cherche si l'utilisateur est déjà dans le tableau usersDisliked
                if (sauce.usersDisliked.includes(userId)) { 
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                        .then(() => res.status(200).json({ message: 'Dislike supprimé !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(404).json({ error }))
        break;
        
        //il s'agit un DISLIKE
        case -1 :
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: "Je n'aime pas" }) })
            .catch((error) => res.status(400).json({ error }))
        break;
            
        default:
            console.log(error);

    }
}