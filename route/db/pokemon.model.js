const mongoose = require("mongoose")

const PokemonSchema = require('./pokemon.schema').PokemonSchema

const PokemonModel = mongoose.model("Pokemon", PokemonSchema);

function insertPokemon(pokemon) {
    return PokemonModel.create(pokemon);
}

function getAllPokemon() {
    return PokemonModel.find().exec();
}

function findPokemonByOwner(owner) {
    return PokemonModel.find({owner: owner}).exec();
}

function findPokemonById(id) {
    return PokemonModel.findById(id).exec();
}

module.exports = {
    findPokemonByOwner,
    insertPokemon,
    getAllPokemon,
    findPokemonById
};