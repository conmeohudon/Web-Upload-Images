// Component Modal Wrapper
function Modal({ isOpen, onClose, children, size = "md" }) {
    if (!isOpen) return null;
    
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg"
    };
    
    return (
        <div 
            className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

// Component Form Input
function FormInput({ label, error, required, ...props }) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

// Component Form Textarea
function FormTextarea({ label, error, required, ...props }) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows={4}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

// Component Form Select
function FormSelect({ label, error, required, children, ...props }) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white text-sm sm:text-base ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

// Component Project Form Modal
function ProjectFormModal({ isOpen, onClose, onSubmit, form, setForm, errors, editingId }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                {editingId ? "Update Project" : "Create New Project"}
            </h3>
            
            {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {errors.submit}
                </div>
            )}

            <div className="space-y-3 sm:space-y-4">
                <FormInput
                    label="Project Name"
                    required
                    type="text"
                    placeholder="Enter project name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    error={errors.name}
                />

                <FormTextarea
                    label="Description"
                    placeholder="Enter project description (optional)"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    error={errors.description}
                />

                <FormSelect
                    label="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </FormSelect>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={onSubmit}
                        className="flex-1 bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        {editingId ? "Save Changes" : "Create Project"}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-400 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ProjectFormModal;