//Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');

//Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();

//importer le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');

//importe le controller
const sauceControl = require('../controllers/sauce');

//importer le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');

// Route qui permet de créer "une sauce"
router.post('/', auth, multer, sauceControl.createSauce);

// Route qui permet de récupérer toutes les sauces
// Renvoie le tableau de toutes les sauces dans la base de données
router.get('/', auth, sauceControl.getAllSauces);

// Route qui permet de cliquer sur une des sauces précise
// Renvoie la sauce avec l'ID fourni
router.get('/:id', auth, sauceControl.getOneSauce);

// Route qui permet de modifier "une sauce"
// Met à jour la sauce avec l'identifiant fourni.
router.put('/:id', auth, multer, sauceControl.modifySauce);

// Route qui permet de supprimer "une sauce"
// Supprime la sauce avec l'ID fourni.
router.delete('/:id', auth, sauceControl.deleteSauce);

// Route qui permet de gérer les likes des sauces
router.post('/:id/like',auth,sauceControl.likeDislikeSauce);

module.exports = router;