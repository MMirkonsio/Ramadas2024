import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CiStopwatch, CiTrash } from 'react-icons/ci';
import "../components/contador.css";
import { UserAuth } from "../context/AuthContext";

const Contador = ({ userId, titulo, minutos, segundos, onEliminar }) => {
  const [tiempo, setTiempo] = useState({ minutos, segundos });
  const [estado, setEstado] = useState('Pendiente');
  const { user } = UserAuth();

  useEffect(() => {
    // Recuperar el estado del contador desde localStorage
    const storedTime = JSON.parse(localStorage.getItem(`contador-${userId}-${titulo}`));
    if (storedTime) {
      setTiempo(storedTime);
    }
  }, [userId, titulo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo((prev) => {
        if (prev.minutos === 0 && prev.segundos === 0) {
          clearInterval(interval);
          setEstado('Listo');
          return prev;
        } else {
          const newTiempo = prev.segundos === 0
            ? { minutos: prev.minutos - 1, segundos: 59 }
            : { minutos: prev.minutos, segundos: prev.segundos - 1 };
          // Guardar el estado actualizado en localStorage
          localStorage.setItem(`contador-${userId}-${titulo}`, JSON.stringify(newTiempo));
          return newTiempo;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userId, titulo]);

  return (
    <div className={`border-2 p-4 my-4 flex flex-col items-center rounded-lg ${estado === 'Listo' ? 'blink' : ''}`}>
      {user && (
        <div className="block min-w-[300px] mb-2 gap-8">
          <h2 className="text-4xl font-bold break-words">{titulo}</h2>
          <div className="flex items-center text-3xl">
            <CiStopwatch className="mr-2" />
            {tiempo.minutos < 10 ? `0${tiempo.minutos}` : tiempo.minutos}:
            {tiempo.segundos < 10 ? `0${tiempo.segundos}` : tiempo.segundos}
          </div>
        </div>
      )}
      <div className="flex justify-between w-full">
        <p
          className={`relative p-2 rounded font-bold text-2xl ${
            estado === 'Pendiente' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {estado}
        </p>
        <button
          onClick={() => onEliminar(userId)}
          className="text-red-500 hover:text-red-700"
          style={{ fontSize: '3rem' }}
        >
          <CiTrash />
        </button>
      </div>
    </div>
  );
};

Contador.propTypes = {
  userId: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  minutos: PropTypes.number.isRequired,
  segundos: PropTypes.number.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

export default Contador;
