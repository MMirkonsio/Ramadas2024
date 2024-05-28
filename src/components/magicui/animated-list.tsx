import React from 'react';
import { motion } from 'framer-motion';
import Contador from '../Contador'; // Ajusta la ruta según tu estructura

interface AnimatedListItemProps {
  userId: string; // Cambia el tipo de userId según corresponda
  titulo: string;
  minutos: number;
  segundos: number;
  onEliminar: () => void;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ userId, titulo, minutos, segundos, onEliminar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Contador userId={userId} titulo={titulo} minutos={minutos} segundos={segundos} onEliminar={onEliminar} setConfirmacionAbierta/>
    </motion.div>
  );
};

export default AnimatedListItem;
