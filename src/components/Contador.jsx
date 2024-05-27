import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CiStopwatch, CiTrash } from 'react-icons/ci';

const Contador = ({ titulo, minutos, segundos, onEliminar }) => {
  const [user, setUser] = useState(null);
  const [tiempo, setTiempo] = useState({ minutos, segundos });
  const [estado, setEstado] = useState('Pendiente');

  useEffect(() => {
    const interval = setInterval(() => {
      if (tiempo.minutos === 0 && tiempo.segundos === 0) {
        clearInterval(interval);
        setEstado('Listo');
      } else {
        if (tiempo.segundos === 0) {
          setTiempo((prev) => ({ minutos: prev.minutos - 1, segundos: 59 }));
        } else {
          setTiempo((prev) => ({ minutos: prev.minutos, segundos: prev.segundos - 1 }));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tiempo]);

  return (
    <div className="border-2 p-4 my-4 flex flex-col items-center rounded-lg">
      <div className="block min-w-[350px] mb-2 gap-8">
        <h2 className="text-4xl font-bold break-words">{titulo}</h2>
        <div className="flex items-center text-3xl">
          <CiStopwatch className="mr-2" />
          {tiempo.minutos < 10 ? `0${tiempo.minutos}` : tiempo.minutos}:
          {tiempo.segundos < 10 ? `0${tiempo.segundos}` : tiempo.segundos}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <p
          className={`relative p-2 rounded font-bold text-2xl ${
            estado === 'Pendiente' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {estado}
        </p>
        <button
          onClick={() => onEliminar(user)} // Pasar el ID del usuario al eliminar
          className="text-red-500 hover:text-red-700"
          style={{ fontSize: '3rem' }} // Ajusta el tamaño del botón de eliminación aquí
        >
          <CiTrash />
        </button>
      </div>

    </div>
  );
};

Contador.propTypes = {
  titulo: PropTypes.string.isRequired,
  minutos: PropTypes.number.isRequired,
  segundos: PropTypes.number.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

export default Contador;