// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded p-4 max-w-lg w-full">
        <div className="flex justify-between">
        <div>{children}</div>
          <button onClick={onClose} style={{ fontSize: "2.5rem" }} className="text-gray-500 hover:text-gray-700">&times;</button>
          
        </div>
       
      </div>
    </div>
  );
};

export default Modal;
