const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Sauce = require('./models/Sauce');

mongoose.connect('mongodb+srv://radjou:sailaja@cluster0.5c8jm.mongodb.net/piiquanteDataBase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Object Enregistré !'}))
        .catch(error => res.status(400).json({ error }))
});


app.use('/api/sauces', (req, res, next) => {
    const sauces = [
      {
        _id: 'oeihfzeoi',
        name: 'Purée de piment antillais',
        manufacturer: 'Fabricant de la sauce',
        description: 'La purée de piment Dame Besson est composée de : piment antillais, huile de tournesol, vinaigre, sel. Antioxydant: acide ascorbique Sans colorant, sans conservateur ! ',
        mainPepper: 'Le Piment— le principal ingrédient épicé de la sauce',
        imageUrl: 'https://www.tilolo.fr/img/152/79416/m/p/puree-de-piment-antillais.jpg',
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        name: 'Sauce Yassa BIO',
        manufacturer: 'Yassa',
        description: 'Eau, oignons, jus de citron, coriandre, persil, gingembre, ail, laurier, sel de Guérande. ',
        mainPepper: 'Poulet — le principal ingrédient épicé de la sauce',
        imageUrl: 'http://chef-gondo.com/site/wp-content/uploads/2018/08/Capture-d%E2%80%99e%CC%81cran-2018-05-09-a%CC%80-18.07.23.png',
        userId: 'qsomihvqios',
      },
    ];
    res.status(201).json(sauces);
});

module.exports = app;