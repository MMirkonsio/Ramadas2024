import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

export const supabase = createClient(
    import.meta.env.VITE_APP_SUPABASE_URL,
    import.meta.env.VITE_APP_SUPABASE_ANON_KEY,
);

const SupabaseConfig = () => {
  const { user } = UserAuth(); // Accede a UserAuth dentro de un componente funcional

  useEffect(() => {
    // Verifica si hay un usuario autenticado antes de insertar en la tabla de contadores
    if (user) {
      // Suponiendo que tienes acceso a 'titulo' y 'tiempo' en este contexto
      const nuevoTitulo = "Título del contador";
      const nuevoTiempo = "Tiempo del contador";

      // Inserta los datos en la tabla de contadores con el usuario_id asociado
      supabase
        .from("contador")
        .insert([
          { usuario_id: user.id, titulo: nuevoTitulo.trim(), tiempo: nuevoTiempo },
        ])
        .then(async ({ data: contadorData, error: contadorError }) => {
          if (contadorError) {
            throw contadorError;
          }

          // Obtener el ID del contador recién insertado
          const contadorId = contadorData[0].id;

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

          // Realiza alguna acción después de la inserción exitosa, si es necesario
          console.log("Datos insertados correctamente:", {
            contadorData,
            montoTotalData,
          });
        })
        .catch((error) => {
          console.error("Error al insertar datos:", error.message);
        });
    }
  }, [user]); // Ejecuta este efecto cuando 'user' cambie

  return null; // No renderiza nada ya que este componente solo ejecuta un efecto
};

export default SupabaseConfig;