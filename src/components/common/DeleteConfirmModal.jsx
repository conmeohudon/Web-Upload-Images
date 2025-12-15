import React from "react";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    
    return (
        <div 
            className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Confirm Delete
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
                Bạn có chắc muốn xóa tài khoản này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-red-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                    Delete
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 bg-gray-400 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

export default DeleteConfirmModal;
