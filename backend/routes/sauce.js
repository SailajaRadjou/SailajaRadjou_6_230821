const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sauceControl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceControl.createSauce);

router.get('/', auth, sauceControl.getAllSauces);

router.get('/:id', auth, sauceControl.getOneSauce);

router.put('/:id', auth, multer, sauceControl.modifySauce);

router.delete('/:id', auth, sauceControl.deleteSauce);

//router.like('/:id/like',sauceControl.likeSauce);

module.exports = router;