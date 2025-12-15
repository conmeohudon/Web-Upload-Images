function DeleteConfirmProjectModal({ isOpen, onClose, onConfirm, project, deleteImages, setDeleteImages }) {
    if (!project) return null;
    
    const hasImages = project.imageCount > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Confirm Delete Project
            </h3>
            
            {hasImages && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <div>
                            <p className="font-semibold text-sm sm:text-base">Warning: This project has {project.imageCount} image(s)</p>
                            <p className="text-xs sm:text-sm mt-1">Please choose what to do with the images:</p>
                        </div>
                    </div>
                </div>
            )}
            
            <p className="text-sm sm:text-base text-gray-600 mb-4">
                Bạn có chắc muốn xóa project "<strong>{project.name}</strong>" không?
            </p>

            {hasImages && (
                <div className="mb-6 space-y-3">
                    <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="radio"
                            name="deleteOption"
                            checked={!deleteImages}
                            onChange={() => setDeleteImages(false)}
                            className="mt-1 mr-3 flex-shrink-0"
                        />
                        <div>
                            <div className="font-medium text-gray-900 text-sm sm:text-base">Keep images</div>
                            <div className="text-xs sm:text-sm text-gray-600">Delete only the project, images will remain in the system</div>
                        </div>
                    </label>
                    
                    <label className="flex items-start p-3 border-2 border-red-200 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
                        <input
                            type="radio"
                            name="deleteOption"
                            checked={deleteImages}
                            onChange={() => setDeleteImages(true)}
                            className="mt-1 mr-3 flex-shrink-0"
                        />
                        <div>
                            <div className="font-medium text-red-900 text-sm sm:text-base">Delete project and all images</div>
                            <div className="text-xs sm:text-sm text-red-600">This action cannot be undone!</div>
                        </div>
                    </label>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-red-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                    {hasImages && deleteImages ? "Delete Project & Images" : "Delete Project"}
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

export default DeleteConfirmProjectModal;