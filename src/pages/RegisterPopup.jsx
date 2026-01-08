import React from 'react';

const RegisterPopup = ({ isOpen, onClose, onConfirm, tournamentId }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"></div>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Confirm Registration</h2>
          <p className="mb-4">Are you sure you want to register for this tournament?</p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#154947] text-white rounded-lg hover:bg-purple-700"
              onClick={() => onConfirm(tournamentId)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPopup;