import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CiStopwatch } from "react-icons/ci";
import "../components/contador.css";
import { UserAuth } from "../context/AuthContext";
import { MdDelete } from "react-icons/md";

const Contador = ({ userId, titulo, minutos, segundos, onEliminar }) => {
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);

  const [tiempo, setTiempo] = useState({ minutos, segundos });
  const [estado, setEstado] = useState("Pendiente");
  const { user } = UserAuth();

  const confirmarEliminacion = async () => {
    // Lógica para eliminar el contador
    await onEliminar(); // Utiliza la función onEliminar pasada como prop
    setConfirmacionAbierta(false); // Cierra el cuadro de diálogo de confirmación
  };
  
  

  useEffect(() => {
    // Recuperar el estado del contador desde localStorage
    const storedTime = JSON.parse(
      localStorage.getItem(`contador-${userId}-${titulo}`)
    );
    if (storedTime) {
      setTiempo(storedTime);
    }
  }, [userId, titulo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo((prev) => {
        if (prev.minutos === 0 && prev.segundos === 0) {
          clearInterval(interval);
          setEstado("Listo");
          return prev;
        } else {
          const newTiempo =
            prev.segundos === 0
              ? { minutos: prev.minutos - 1, segundos: 59 }
              : { minutos: prev.minutos, segundos: prev.segundos - 1 };
          // Guardar el estado actualizado en localStorage
          localStorage.setItem(
            `contador-${userId}-${titulo}`,
            JSON.stringify(newTiempo)
          );
          return newTiempo;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userId, titulo]);

  return (
    <div
      className="border-2 p-4 my-2 flex flex-col items-center rounded-lg" >
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
        {confirmacionAbierta && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-xl mb-4">
                ¿Estás seguro de que quieres eliminar este contador?
              </p>
              <div className="flex justify-center">
                <button
                  onClick={confirmarEliminacion}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-600"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmacionAbierta(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        <p
          className={`p-2 rounded font-bold text-2xl ${
            estado === "Pendiente"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {estado}
        </p>
        <button
          onClick={() => setConfirmacionAbierta(true)}
          className="text-red-500 hover:text-red-700"
          style={{ fontSize: "3rem" }}
        >
          <MdDelete />
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
