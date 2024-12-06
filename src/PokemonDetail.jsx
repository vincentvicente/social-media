import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { redirect } from "react-router-dom";

export default function PokemonDetail() {
    const [pokemonDetailsState, setPokemonDetailState] = useState(null);
    const [errorState, setErrorState] = useState('');

    const params = useParams();

    const navigate = useNavigate()

    async function getPokemonDetails() {
        let response;
        try {
            response = await axios.get('/api/pokemon/' + params.pokemonId)      
            
            setPokemonDetailState(response.data);
        } catch (error) {
            console.log(error)
            setErrorState('Issue loading pokemon');
        }


    }

    useEffect(() => {
        getPokemonDetails()
    }, []);

    if(errorState) {
        return (<div>Unable to load pokemon...</div>)
    }

    if(!pokemonDetailsState) {
        return (<div>Loading...</div>)
    }

    return (<div>
        Pokemon Details Here for: {params.pokemonId}
        <div>Name: {pokemonDetailsState.name}</div>
        <div>Health: {pokemonDetailsState.health}</div>
        <div>Level: {pokemonDetailsState.health}</div>
    </div>)


}