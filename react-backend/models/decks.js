"use strict"
var mongoose = require('mongoose');

var decksSchema = mongoose.Schema({
  name: String,
  description: String,
  cards: Array
});

var Decks = mongoose.model('Decks', decksSchema);
module.exports = Decks;
