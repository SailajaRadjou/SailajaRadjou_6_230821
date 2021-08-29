const Sauce = require('../models/Sauce');
const fs = require('fs');

//créé une nouvelle sauce POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new Sauce({
     ...sauceObject,
     //création de URL d'image
     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //Enregistrement de l'objet Sauce dans la base de donnée
    sauce.save()
        .then(() => res.status(201).json({ message: 'Object Enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

//lecture de toutes les sauces dans la DB GET
exports.getAllSauces = (req, res, next) => {
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
   const sauceObject = req.file ?
   //si l'image existe
   {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   //si l'image n'existe pas
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object Modifié ! '}))
    .catch(error => res.status(400).json({ error }));
}

//supprimer une sauce DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        //récupération du nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];

        //pour supprimer l'image dans le fichier UNLINK
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet Supprimé !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));    
}

/*exports.likeSauce = (req, res, next) => {

}*/