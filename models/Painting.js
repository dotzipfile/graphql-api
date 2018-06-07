/*
 *  Model for data related to paintings
 */

// External dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for paintings
const PaintingSchema = new Schema({
  name: String,
  url: String,
  techniques: [ String ]
});

// Export the module
module.exports = mongoose.model('Painting', PaintingSchema);
