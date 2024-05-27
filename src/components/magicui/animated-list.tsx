import React from 'react';
import { motion } from 'framer-motion';
import Contador from '../Contador';

interface AnimatedListItemProps {
  titulo: string;
  minutos: number;
  segundos: number;
  onEliminar: () => void;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ titulo, minutos, segundos, onEliminar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Contador titulo={titulo} minutos={minutos} segundos={segundos} onEliminar={onEliminar} />
    </motion.div>
  );
};

export default AnimatedListItem;
  