import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import AnimatedListItem from "../components/magicui/animated-list";
import { AnimatePresence } from "framer-motion";
import { GoSignOut } from "react-icons/go";
import { PiCurrencyCircleDollar } from "react-icons/pi";
import Modal from "../components/modal";
import { FormularioContador } from "./Formulario";
import { supabase } from "../supabase/supabase.config";
import { MdDelete } from "react-icons/md";

export const HeaderMain = () => {
  const { user, handleSignOut } = UserAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOpen, setIsModalOpen] = useState(false);
  const [contadores, setContadores] = useState([]);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [montoTotal, setMontoTotal] = useState(null);
  useEffect(() => {
    const fetchMontoTotal = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("montoTotal")
          .select("monto")
          .eq("usuario_id", user.id);
    
        if (error) {
          console.error("Error fetching monto total:", error.message);
        } else {
          // Sumar los valores de la columna "monto"
          let total = 0;
          data.forEach((row) => {
            total += row.monto;
          });
          setMontoTotal(total);
        }
      }
    };
    
    

    if (isOpen) {
      fetchMontoTotal();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const fetchContadores = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("contador")
          .select("*")
          .eq("usuario_id", user.id);

        if (error) {
          console.error("Error fetching contadores:", error);
        } else {
          setContadores(data);
        }
      }
    };

    fetchContadores();
  }, [user]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setMenuVisible(false);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleAgregar = async (data) => {
    if (!Array.isArray(data)) {
      console.error("Error: data is not an array", data);
      return;
    }

    if (user) {
      try {
        const { data: insertedData, error } = await supabase
          .from("contador")
          .insert(data)
          .select("*");

        if (error) {
          throw error;
        }

        // Obtener el ID del contador recién insertado
        const contadorId = insertedData[0].id;

        // Insertar en la tabla de montoTotal
        const { data: montoTotalData, error: montoTotalError } = await supabase
          .from("montoTotal")
          .insert([
            {
              usuario_id: user.id,
              contador_id: contadorId,
              monto: 2000, // Aquí puedes establecer el monto inicial
            },
          ])
          .select("*");

        if (montoTotalError) {
          throw montoTotalError;
        }

        console.log(
          "Datos insertados correctamente en la tabla montoTotal:",
          montoTotalData
        );

        // Actualiza el estado con el nuevo contador agregado
        setContadores((prevContadores) => [...prevContadores, ...insertedData]);
      } catch (error) {
        console.error("Error al insertar datos:", error.message);
      }
    }
  };


  
  const eliminarContador = async (index) => {
    try {
      const contadorId = contadores[index].id;

      // Elimina el registro en la tabla contador
      await supabase.from("contador").delete().eq("id", contadorId);

      // Actualiza el estado de los contadores después de la eliminación
      setContadores((prevContadores) =>
        prevContadores.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error al eliminar el contador:", error.message);
    }
  };

  const confirmarEliminacion = () => {
    setConfirmacionAbierta(true);
  };

  const cancelarEliminacion = () => {
    setConfirmacionAbierta(false);
  };

  const eliminarTodosLosContadores = async () => {
    setConfirmacionAbierta(false);
    if (user) {
      try {
        await supabase.from("contador").delete().eq("usuario_id", user.id);
        setContadores([]);
      } catch (error) {
        console.error("Error al eliminar todos los contadores:", error.message);
      }
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4">
        <div className="flex flex-row">
          <p className="text-blue-500 lg:text-2xl text-xl font-bold">Ramadas</p>
          <p className="text-red-500 lg:text-2xl text-xl font-bold ml-1">
            2024
          </p>
        </div>
        <div className="relative flex items-center gap-1">
          {user && (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={toggleMenu}
            >
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">
                {user.user_metadata.full_name}
              </span>
            </div>
          )}
          {menuVisible && (
            <div className="absolute top-10 right-0 w-full bg-white border rounded shadow-lg">
              <div className="flex flex-col">
                <button
                  onClick={openModal}
                  className="p-2 flex items-center gap-2 hover:bg-gray-100"
                >
                  <PiCurrencyCircleDollar style={{ fontSize: "1.5rem" }} />
                  <span>Monto Total</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 flex items-center gap-2 hover:bg-gray-100"
                >
                  <GoSignOut style={{ fontSize: "1.5rem" }} />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-4">
        <div>
          <h1 className="font-bold text-5xl flex flex-col items-center">
            SISTEMA <p>CONTADOR</p>DE NIÑOS
          </h1>
        </div>
        <div>
          <FormularioContador onAgregar={handleAgregar} />
          <button
            className="flex justify-center gap-1 mb-4 items-center bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full "
            onClick={confirmarEliminacion}
          >
            <MdDelete style={{ fontSize: "1.3rem" }} />
            Eliminar Todo
          </button>
        </div>

        <AnimatePresence>
          {contadores.map((contador, index) => (
            <AnimatedListItem
            key={contador.id}
            userId={user.id}
            titulo={contador.titulo}
            minutos={contador.tiempo}
            segundos={0}
            onEliminar={() => eliminarContador(index)}
            setConfirmacionAbierta={setConfirmacionAbierta} // Asegúrate de pasar setConfirmacionAbierta
          />
          
          ))}
        </AnimatePresence>
       

        {confirmacionAbierta && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-xl mb-4">
                ¿Estás seguro de que quieres eliminar todos los contadores?
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    eliminarTodosLosContadores();
                    confirmarEliminacion();
                  }}
                  
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-600"
                >
                  Confirmar
                </button>
                <button
                onClick={() => {
                  cancelarEliminacion();
                  setConfirmacionAbierta(false);
                }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
         <Modal isOpen={isOpen} onClose={onClose}>
          <h2 className="text-2xl font-bold mb-4">Monto total</h2>
          {montoTotal !== null ? (
           <p className="text-xl">El monto total es: ${montoTotal.toLocaleString("es-CL")}</p>

          ) : (
            <p className="text-xl">Cargando...</p>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default HeaderMain;
