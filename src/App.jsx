import { useState, useEffect } from 'react';
import Contador from './Contador';
import "./App.css"


const App = () => {
  const [contadores, setContadores] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoTiempo, setNuevoTiempo] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false); // Estado de confirmación
  
  
  const agregarContador = () => {
    if (nuevoTitulo && nuevoTiempo > 0) {
      const nuevoContador = { titulo: nuevoTitulo, minutos: nuevoTiempo, segundos: 0 };
      setContadores([...contadores, nuevoContador]);
      setNuevoTitulo('');
      setNuevoTiempo('');

      // Guardar en localStorage
      const contadoresGuardados = JSON.parse(localStorage.getItem('contadores')) || [];
      localStorage.setItem('contadores', JSON.stringify([...contadoresGuardados, nuevoContador]));
    }
  };

  const eliminarContador = (index) => {
    const nuevosContadores = [...contadores];
    nuevosContadores.splice(index, 1);
    setContadores(nuevosContadores);
    // Además, puedes eliminar el contador del almacenamiento local si es necesario
  };
  

  const limpiarContadores = () => {
    if (!confirmarEliminacion) {
      // Si el usuario aún no ha confirmado, muestra la alerta
      const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar todos los contadores?');
      if (confirmacion) {
        // Si el usuario confirma, elimina todos los contadores
        setContadores([]);
        localStorage.removeItem('contadores');
      }
    }
  };
  

  useEffect(() => {
    // Cargar datos desde localStorage
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
    <div className="flex flex-col bg-gray-100 mx-auto p-4">
      <h1 className="flex justify-center items-center text-5xl font-bold text-center">
        <div className="flex flex-col items-center">
          <p className='text-blue-500'>Ramadas</p>
          <p className='text-red-500'>2024</p>
        </div>
        <img src="/img/fiestas-patrias.png" alt="Fiestas"/>
      </h1>
      <div className="my-4 flex flex-col gap-3">
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
          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded ml-2"
          disabled={confirmarEliminacion} // Deshabilita el botón si ya se confirmó
        >
          Limpiar Todo
        </button>
      </div>
      {contadores.map((contador, index) => (
      <Contador
        key={index}
        titulo={contador.titulo}
        minutos={contador.minutos}
        segundos={contador.segundos}
        onEliminar={() => eliminarContador(index)} // Asegúrate de que estás pasando la función correctamente
      />
    ))}
    </div>
  );
};

export default App;
