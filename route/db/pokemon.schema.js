const Schema = require('mongoose').Schema;


exports.PokemonSchema = new Schema({
    // mongoose automically gives this an _id attribute of ObjectId
    name: String,
    owner: String,
    health: Number,
    level: { type: Number, min: 0, max: 100 },
// this explicitly declares what collection we're using
}, { collection : 'pokemonFall2024' });