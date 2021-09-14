const express = require('express');

// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();
const userControl = require('../controllers/user');


// Crée un nouvel utilisateur
router.post('/signup', userControl.signup);

// Connecte un utilisateur
router.post('/login', userControl.login);

module.exports = router;