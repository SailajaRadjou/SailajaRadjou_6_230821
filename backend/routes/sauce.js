const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauce');

router.post('/', sauceControl.createSauce);

router.get('/', sauceControl.getAllSauces);

router.get('/:id', sauceControl.getOneSauce);

router.put('/:id', sauceControl.modifySauce);

router.delete('/:id', sauceControl.deleteSauce);

module.exports = router;