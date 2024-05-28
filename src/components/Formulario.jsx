// FormularioContador.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase/supabase.config'; // Ajusta la ruta de importación según tu estructura
import { UserAuth } from '../context/AuthContext'; // Ajusta la ruta de importación según tu estructura
import { IoMdPersonAdd } from "react-icons/io";



export const FormularioContador = ({ onAgregar }) => {
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoTiempo, setNuevoTiempo] = useState('');
  const { user } = UserAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Nuevo título:', nuevoTitulo);
    console.log('Nuevo tiempo:', nuevoTiempo);
  
    if (nuevoTitulo.trim() !== '' && nuevoTiempo.trim() !== '') {
      const tiempo = parseInt(nuevoTiempo, 10); // Convertir a número
      console.log('Tiempo parseado:', tiempo);
  
      if (!isNaN(tiempo) && tiempo > 0) {
        try {
          console.log('Usuario ID:', user.id);
          console.log('Tipo de dato de usuario_id:', typeof user.id);
  
          const data = [{ usuario_id: user.id, titulo: nuevoTitulo.trim(), tiempo: tiempo }];
          console.log('Datos a insertar:', data);
  
          // Llama a la función onAgregar con los datos como un array
          onAgregar(data);
  
          // Limpiar los campos después de agregar el contador
          setNuevoTitulo('');
          setNuevoTiempo('');
        } catch (error) {
          console.error('Error al comunicarse con la base de datos:', error);
        }
      } else {
        alert('Ingrese un tiempo válido en minutos.');
      }
    } else {
      alert('Por favor complete todos los campos.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="my-4 flex flex-col gap-3">
      <input
        name="titulo"
        type="text"
        placeholder="Nombre del niño"
        value={nuevoTitulo}
        onChange={(e) => setNuevoTitulo(e.target.value)}
        className="p-2 border rounded mr-2"
        required
      />
      <input
        name="tiempo"
        type="number"
        placeholder="Tiempo en minutos"
        value={nuevoTiempo}
        onChange={(e) => setNuevoTiempo(e.target.value)}
        className="p-2 border rounded mr-2"
        required
      />
      <button
        type="submit"
        className="flex justify-center gap-1 items-center bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
      ><IoMdPersonAdd style={{ fontSize:"1.3rem" }}/>
        Agregar Niño
      </button>

      
    </form>
  );
};
