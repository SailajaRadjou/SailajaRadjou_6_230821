//importe mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//création du model User pour un stockage dans la base de donnée
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

//uniqueValidator - pour éviter plusieurs utilisateurs s'inscrivent avec le même email Id
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);