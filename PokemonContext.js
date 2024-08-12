// PokemonContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const PokemonContext = createContext();

// Crear el proveedor del contexto
export const PokemonProvider = ({ children }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
        const data = await response.json();
        setPokemons(data.results); // Solo guardar los resultados
      } catch (error) {
        console.error('Error fetching pokemons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  return (
    <PokemonContext.Provider value={{ pokemons, loading }}>
      {children}
    </PokemonContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const usePokemons = () => useContext(PokemonContext);
