const express = require('express');
const router = express.Router();
const pokemonModel = require('./db/pokemon.model');
const jwtHelpers = require('./helpers/jwt')


const pokemonDB = [
    {
        id: 1,
        name: 'Pikachu',
        health: 100,
        level: 10,
    },
    {
        id: 2,
        name: 'Charizard',
        health: 200,
        level: 50,
    },
    {
        id: 3,
        name: "Pikachard",
        health: 300,
        level: 99,
    },
]



// http://localhost:3000/api/pokemon/
router.get('/', async function(req, res) {
    /*
    http://localhost:3000/api/pokemon/?name=Pika
    req.query = {
        name: 'Pika
    }
    */

    const owner = jwtHelpers.decrypt(req.cookies.pokemonToken);

    const pokemonList = await pokemonModel.findPokemonByOwner(owner);

    res.cookie("huntersFavPokemon", "Pikachu");
    res.send(pokemonList);


    // const nameSearchQuery = req.query.name;

    // if(!nameSearchQuery) {
    //     res.send(pokemonDB);
    //     return;
    // }

    // const pokemonResponseList = [];
    // for(let i = 0; i < pokemonDB.length; i++) {
    //     if(pokemonDB[i].name.includes(nameSearchQuery)) {
    //         pokemonResponseList.push(pokemonDB[i])
    //     }
    // }

    // res.send(pokemonResponseList)
})

// http://localhost:3000/api/pokemon/1 => Pikachu
router.get('/:pokemonId', async function(req, res) {

    const owner = jwtHelpers.decrypt(req.cookies.pokemonToken);

    
    const pokemonId = req.params.pokemonId;

    /*

    http://localhost:3000/api/pokemon/1
    req.params = {
        pokemonId: 1,
    }
    */

    const cookies = req.cookies;
    console.log("This is my fav pokemon: ", cookies.huntersFavPokemon);

    try {
        const pokemon = await pokemonModel.findPokemonById(pokemonId);
        
        if(pokemon.owner !== owner) {
            res.status(404)
            res.send("You do not have permissiont to access pokemon " + req.params.pokemonId + "");

        }

        
        return res.send(pokemon);


    } catch (error) {
        res.status(404)
        res.send("No pokemon with ID " + req.params.pokemonId + " found :(");
    
    }


    // for(let i = 0; i < pokemonDB.length; i++) {
    //     if(pokemonDB[i].id.toString() === req.params.pokemonId) {
    //         return res.send(pokemonDB[i]);
    //     }
    // }


})

router.post('/', async function(req, res) {
    const newPokemon = {};

    if(!req.body.name) {
        res.status(400);
        return res.send('Some values for new pokemone missing: ' + JSON.stringify(req.body));
    }

    newPokemon.name = req.body.name;

    const owner = jwtHelpers.decrypt(req.cookies.pokemonToken);
    newPokemon.owner = owner;

    if(!req.body.health) {
        newPokemon.health = 100;
    }

    if(!req.body.level) {
        newPokemon.level = 1;
    }

    const pokemonDBResponse = await pokemonModel.insertPokemon(newPokemon);

    // if(!name) {
    //     res.status(400);
    //     return res.send('Some values for new pokemone missing: ' + JSON.stringify(req.body));
    // }



    // const id = pokemonDB.length + 1;

    // const newPokemon = {
    //     name: name,
    //     level: level,
    //     health: health,
    //     id: id,
    // }

    // pokemonDB.push(newPokemon);


    res.send(pokemonDBResponse);
})

// // http://localhost:3000/api/pokemon/favorite
// router.get('/favorite', function(req, res) {
//     res.send('Insert fav pokemon here')
// })

module.exports = router;


// https://www.amazon.com/s?k=bananas


// https://www.google.com/search?
// q=banana
// &
// sca_esv=fdf711029b3ac2cc
// &
// sxsrf=ADLYWII3VnuXffT4ttzzUsl3DoqsAqAZEQ%3A1731642035039
// &
// source=hp
// &
// ei=ssI2Z6qoPKLw0PEP_qeXsAM
// &
// iflsig=AL9hbdgAAAAAZzbQw_j7tei4x1cifyM1mLC7k4wYKe6E&ved=0ahUKEwiqyf6itd2JAxUiODQIHf7TBTYQ4dUDCBg
// &
// uact=5&
// oq=banana
// &gs_lp=Egdnd3Mtd2l6IgZiYW5hbmEyCBAAGIAEGLEDMg4QLhiABBixAxjRAxjHATIOEC4YgAQYsQMY0QMYxwEyCBAuGIAEGLEDMggQLhiABBixAzIFEC4YgAQyCBAAGIAEGLEDMggQABiABBixAzILEC4YgAQYsQMY1AIyCBAAGIAEGLEDSPwEUABYxANwAHgAkAEAmAE9oAHNAqoBATa4AQPIAQD4AQGYAgagAvECwgIOEAAYgAQYsQMYgwEYigXCAgsQABiABBixAxiDAcICERAuGIAEGLEDGNEDGIMBGMcBwgIIEC4YgAQY1ALCAgsQLhiABBjRAxjHAcICBRAAGIAEwgILEC4YgAQYsQMYgwHCAg4QLhiABBixAxiDARiKBcICFBAuGIAEGLEDGNEDGIMBGMcBGMkDwgILEAAYgAQYkgMYigXCAg4QLhiABBjHARiOBRivAZgDAJIHATagB_tW&sclient=gws-wiz&safe=active&ssui=on


// https://www.amazon.com/dp/B07FYYKKQK/