import axios from "axios";
import { useEffect, useState } from "react";
import './Homepage.css';
import { Link } from "react-router-dom";

export default function Homepage() {
    const [pokemonState, setPokemonState] = useState([]);
    const [pokemonName, setPokemonNameState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState(null);

    useEffect(() => {
        getPokemon()
    }, []);

    async function getPokemon() {
        const response = await axios.get('/api/pokemon')

        setPokemonState(
            response.data
        )
    }

    const pokemonComponents = [];
    for(let i = 0; i < pokemonState.length; i++) {
        const pokemon = pokemonState[i];
        const newPokeComponent = (<div>
            Name: {pokemon.name} 
            - Health: {pokemon.health} 
            - Level: {pokemon.level}
            - Owner: {pokemon.owner}
            - <Link to={'/pokemon/' + pokemon._id} > Edit</Link>
         </div>)
        pokemonComponents.push(newPokeComponent)
    }

    function updatePokemonName(event) {
        console.log(event.target.value);
        setPokemonNameState(event.target.value);
    }

    async function createNewPokemon() {
        setErrorMsgState(null);

        const newPokemon = {
            name: pokemonName,
        }

        if(!pokemonName) {
            setErrorMsgState('Please add valid Pokemon Name')
            return;
        }

        try {
            await axios.post('/api/pokemon', newPokemon);
        } catch (error) {
            console.log(error)
            setErrorMsgState(error.response.data);
            return;
        }

        setPokemonNameState('');
        
        await getPokemon();
    }

    return (<div>
        <h1>Show Pokemon Here</h1>
        <div>
            <h2>Add new Pokemon</h2>
            {errorMsgState && <div className="errorMessage">ERROR: {errorMsgState}</div>}
            <div>Pokemon Name:</div>
            <input value={pokemonName} onChange={(event) => updatePokemonName(event)}/>
            <div>
                <button onClick={() => createNewPokemon()}>Create New Pokemon</button>
            </div>
        </div>
        <h2>All Pokemon</h2>
        <button onClick={() => getPokemon()}>Click here to get Pokemon</button>
        {
            pokemonComponents
        }
    </div>);

}