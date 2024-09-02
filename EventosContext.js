// PokemonContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const EventosContext = createContext();

// Crear el proveedor del contexto
export const EventosProvider = ({ children }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const response = await fetch('https://grateful-boar-definitely.ngrok-free.app/api/province');
        const data = await response.json();
        setEventos(data.results); // Solo guardar los resultados
      } catch (error) {
        console.error('Error fetching eventos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEventos();
  }, []);

  return (
    <EventosContext.Provider value={{ eventos, loading }}>
      {children}
    </EventosContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useEventos = () => useContext(EventosContext);
