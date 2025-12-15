import React from "react";

function DeleteConfirmModal({ show, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Confirm Delete
                </h3>

                <p className="text-gray-600 mb-6">
                    Bạn có chắc muốn xóa tài khoản này?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                    >
                        Delete
                    </button>

                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
