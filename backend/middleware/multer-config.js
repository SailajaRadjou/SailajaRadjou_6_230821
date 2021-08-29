//utilisation de multer pour enregistrer images dans les fichiers
const multer = require('multer');

//bibliothèque de l'extension des fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
    //l'enregistrement dans le dossiers "images"
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //générer le nom du fichier avec le nom d'origine,numéro unique avec "." + extension
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');