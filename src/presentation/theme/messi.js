import React, { useState } from 'react';


const SiDeseaQueElEquipoHagaUnGol = () => {
 
  const [jugadorConPelota, setJugadorConPelota] = useState('Jugador1');

  function decidirAccionConPelota(jugadorHabilitado) {
    if (jugadorHabilitado === 'Messi') {
      return 'Pasar la pelota a Messi.';
    } else {
      if (esArgentino(jugadorHabilitado)) {
        return 'Pasar la pelota y buscar a Messi.';
      } else {
        return 'No se puede pasar la pelota, reiniciar el procedimiento.';
      }
    }
  }

  function manejarPaseDeMessi(jugadorHabilitado) {
    if (jugadorHabilitado === 'Messi') {
      return 'Hacer una pared con Messi.';
    } else {
      return decidirAccionConPelota(jugadorHabilitado);
    }
  }

  function esArgentino(jugador) {
    const jugadoresArgentinos = [ 
        "Emiliano Martínez",
        "Nahuel Molina",
        "Cristian Romero",
        "Nicolás Otamendi",
        "Marcos Acuña",
        "Lisandro Martínez",
        "Rodrigo De Paul",
        "Enzo Fernández",
        "Alexis Mac Allister",
        "Leandro Paredes",
        "Ángel Di María",
        "Lionel Messi",
        "Julián Álvarez",
        "Lautaro Martínez"];
    return jugadoresArgentinos.includes(jugador);
  }

  const cambiarJugador = () => {
    const jugadores = ['Jugador1', 'Jugador2', 'Messi', 'Jugador3'];
    const jugadorActualIndex = jugadores.indexOf(jugadorConPelota);
    const siguienteJugador = (jugadorActualIndex + 1) % jugadores.length;
    setJugadorConPelota(jugadores[siguienteJugador]);
  };

  return (
    <div>
      <h1>Si desea que el equipo haga un gol</h1>
      <p>Jugador actual con la pelota: {jugadorConPelota}</p>
      <p>Acción: {manejarPaseDeMessi(jugadorConPelota)}</p>
      <button onClick={cambiarJugador}>Cambiar jugador</button>
    </div>
  );
};

export default SiDeseaQueElEquipoHagaUnGol;