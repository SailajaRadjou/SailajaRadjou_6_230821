//utilisation de multer pour enregistrer images dans les fichiers
const multer = require('multer');

//bibliothèque de l'extension des fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//crée un objet de configuration pour préciser à multer où enregistrer les fichiers images et les renommer
const storage = multer.diskStorage({
    //l'enregistrement dans le dossiers "images"
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  
   //Indiqué à multer quel nom de fichier on utilise pour éviter les doublons
  filename: (req, file, callback) => {
    //Génèré un nouveau nom avec le nom d'origine, on supprime les espaces (white space avec split) et on insère des underscores à la place
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
     //appelle le callback & passe null pour dire qu'il n'y a pas d'erreur
    //générer le nom du fichier avec le nom d'origine,on ajoute un timestamp avec "." + extension
    callback(null, name + Date.now() + '.' + extension);
  }
});
//export le module, passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({storage: storage}).single('image');