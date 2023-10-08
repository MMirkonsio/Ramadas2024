import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Contador = ({ titulo, minutos, segundos, onEliminar }) => {
  const [tiempo, setTiempo] = useState({ minutos, segundos });
  const [estado, setEstado] = useState('Pendiente');

  useEffect(() => {
    const interval = setInterval(() => {
      if (tiempo.minutos === 0 && tiempo.segundos === 0) {
        clearInterval(interval);
        setEstado('Listo');
      } else {
        if (tiempo.segundos === 0) {
          setTiempo({ minutos: tiempo.minutos - 1, segundos: 59 });
        } else {
          setTiempo({ minutos: tiempo.minutos, segundos: tiempo.segundos - 1 });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tiempo]);

  return (
    <div className="border p-4 my-4 relative">
      <h2 className="text-4xl font-bold text-uppercase">{titulo}</h2>
      <div className="text-3xl flex items-center justify-between">
        <div className="flex font-bold">
            <img
                src="/Stopwatch.svg"
                alt="Icono de cronómetro"
                className="w-10" 
            />
          {tiempo.minutos < 10 ? `0${tiempo.minutos}` : tiempo.minutos}:{' '}
          {tiempo.segundos < 10 ? `0${tiempo.segundos}` : tiempo.segundos}
        </div>
        <div className='relative flex items-center'>
          <p
            className={`relative p-2 rounded font-bold ${
              estado === 'Pendiente' ? 'bg-red-500 text-white text-2xl ' : 'bg-green-500 text-white'
            }`}
          >
            {estado}
          </p>
          <button
            onClick={() => onEliminar()}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            >
            <path
            fill="#ef4444" // Puedes definir el color del relleno directamente en el path
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

Contador.propTypes = {
  titulo: PropTypes.string,
  minutos: PropTypes.number,
  segundos: PropTypes.number,
  onEliminar: PropTypes.func,
};

export default Contador;
