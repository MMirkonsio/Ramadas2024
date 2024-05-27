import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import AnimatedListItem from '../components/magicui/animated-list';
import { AnimatePresence } from 'framer-motion';
import { GoSignOut } from "react-icons/go";

const HomeApp = () => {
  const { user, handleSignOut } = UserAuth();
  const [contadores, setContadores] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoTiempo, setNuevoTiempo] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const agregarContador = () => {
    const tiempo = parseInt(nuevoTiempo, 10);
    if (nuevoTitulo && tiempo > 0) {
      const nuevoContador = { titulo: nuevoTitulo, minutos: tiempo, segundos: 0 };
      setContadores([...contadores, nuevoContador]);
      setNuevoTitulo('');
      setNuevoTiempo('');

      const contadoresGuardados = JSON.parse(localStorage.getItem('contadores')) || [];
      localStorage.setItem('contadores', JSON.stringify([...contadoresGuardados, nuevoContador]));
    }
  };

  const eliminarContador = (userId, index) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este contador?');
    if (confirmacion) {
      // Implementa la lógica para eliminar el contador asociado al usuario con el ID userId
      // Puedes usar el ID del usuario para distinguir los contadores de cada usuario
      const nuevosContadores = [...contadores];
      nuevosContadores.splice(index, 1);
      setContadores(nuevosContadores);
      // Además, puedes eliminar el contador del almacenamiento local si es necesario
    }
  };
  
  

  const limpiarContadores = () => {
    if (!confirmarEliminacion) {
      const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar todos los contadores?');
      if (confirmacion) {
        setContadores([]);
        localStorage.removeItem('contadores');
        setConfirmarEliminacion(true);
      }
    }
  };

  useEffect(() => {
    const contadoresGuardados = JSON.parse(localStorage.getItem('contadores')) || [];
    setContadores(contadoresGuardados);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nuevosContadores = contadores.map((contador) => {
        if (contador.minutos > 0 || contador.segundos > 0) {
          if (contador.segundos === 0) {
            contador.minutos -= 1;
            contador.segundos = 59;
          } else {
            contador.segundos -= 1;
          }
        }
        return contador;
      });

      setContadores(nuevosContadores);
    }, 1000);

    return () => clearInterval(interval);
  }, [contadores]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('contadores', JSON.stringify(contadores));
    });
  }, [contadores]);
 

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4">
        <div className="flex flex-row">
          <p className="text-blue-500 text-2xl font-bold">Ramadas</p>
          <p className="text-red-500 text-2xl font-bold ml-1">2024</p>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <p className="flex items-center space-x-2">
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name}
                className="w-8 h-8 rounded-full"
              />
              <span className='font-semibold'>{user.user_metadata.full_name}!</span>
            </p>
          )}
          <button onClick={handleSignOut} className="text-xl">
            <GoSignOut />
          </button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-4">
        <div>
          <h1 className='font-bold text-5xl flex flex-col items-center'>SISTEMA <p>CONTADOR</p>DE NIÑOS</h1>
        </div>
        <div className="lg:w-2/6 sm:w-full my-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre del niño"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <input
            type="number"
            placeholder="Tiempo en minutos"
            value={nuevoTiempo}
            onChange={(e) => setNuevoTiempo(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={agregarContador}
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
          >
            Agregar Niño
          </button>
          <button
            onClick={limpiarContadores}
            className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
            disabled={confirmarEliminacion}
          >
            Borrar Todo
          </button>
        </div>
        <AnimatePresence>
          {contadores.map((contador, index) => (
            <AnimatedListItem
              key={index}
              titulo={contador.titulo}
              minutos={contador.minutos}
              segundos={contador.segundos}
              onEliminar={() => eliminarContador(user.id, index)} // Pasar el ID del usuario
            />
          ))}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default HomeApp;
