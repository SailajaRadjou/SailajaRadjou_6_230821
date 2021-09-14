const mongoose = require('mongoose');
const sauceSchemaUpdate = mongoose.Schema({
    userId: { type: String },
    name: { type: String },
    manufacturer: { type: String},
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number }
  });
  
  module.exports = mongoose.model('SauceModif', sauceSchemaUpdate);