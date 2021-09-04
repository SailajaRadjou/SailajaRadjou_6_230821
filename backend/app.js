//importation d'express
const express = require('express');

// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
const helmet = require("helmet");

// Permet d'extraire l'objet JSON des requêtes POST
const bodyParser = require('body-parser');

// Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const path = require('path');

// On importe mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

// Déclaration des routes
// On importe la route dédiée aux sauces
const sauceRoutes = require('./routes/sauce');

// On importe la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');

//connexion à la base de donnée MongoDB
mongoose.connect
(
    process.env.MONGO_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Création d'une application express
const app = express();

//Helmet nous aide à sécuriser nos applications Express en définissant différentes en-têtes HTTP
app.use(helmet());

//définition de headers pour éviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // on indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//pour la transformation du corps de la requête en JSON
app.use(bodyParser.json());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware qui va transmettre les requêtes vers les routes correspondantes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;