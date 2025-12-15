import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projectService } from "../../services/projectService.js";

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

// Component Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, project, deleteImages, setDeleteImages }) {
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

// Component Search Bar
function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
            <input
                type="text"
                placeholder="Search by project name..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

// Component Project Table Row
function ProjectTableRow({ project, onEdit, onDelete }) {
    const getStatusBadgeColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{project.id}</td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-medium">{project.name}</td>
            <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600 max-w-md">
                <div className="line-clamp-2">
                    {project.description || <span className="text-gray-400 italic">No description</span>}
                </div>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-center">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {project.imageCount || 0}
                </span>
            </td>
            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(project.status)}`}>
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'N/A'}
                </span>
            </td>
            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(project.createdAt || project.createdat)}
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                <div className="flex justify-end gap-2 sm:gap-3">
                    <button
                        onClick={() => onEdit(project)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded-md hover:bg-indigo-50 transition-colors text-xs sm:text-sm"
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(project)}
                        className="text-red-600 hover:text-red-900 p-1 sm:p-2 rounded-md hover:bg-red-50 transition-colors text-xs sm:text-sm"
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

// Component Pagination
function Pagination({ currentPage, totalPages, indexOfFirstItem, indexOfLastItem, totalItems, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span>{' '}
                of <span className="font-medium">{totalItems}</span> results
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Prev
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                            currentPage === index + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// Main Component
function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "active"
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteProject, setDeleteProject] = useState(null);
    const [deleteImages, setDeleteImages] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const loadProjects = async () => {
        const data = await projectService.getAll();
        setProjects(data);
        setFilteredProjects(data);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        let result = projects;

        if (searchTerm) {
            result = result.filter(project => 
                project.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProjects(result);
        setCurrentPage(1);
    }, [searchTerm, projects]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Project name is required";
        } else if (form.name.length < 3) {
            newErrors.name = "Project name must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (editingId) {
                await projectService.update(editingId, form);
                toast.success('Project updated successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                await projectService.create(form);
                toast.success('Project created successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            setForm({ name: "", description: "", status: "active" });
            setErrors({});
            setShowForm(false);
            setEditingId(null);
            loadProjects();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error('An error occurred. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setErrors({ submit: "An error occurred. Please try again." });
        }
    };

    const handleDelete = (project) => {
        setDeleteProject(project);
        setDeleteImages(false);
    };

    const confirmDelete = async () => {
        try {
            await projectService.delete(deleteProject.id, { deleteImages });
            
            if (deleteImages) {
                toast.success('Project and all images deleted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.success('Project deleted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
            
            setDeleteProject(null);
            setDeleteImages(false);
            loadProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error('Failed to delete project. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setForm({
            name: project.name,
            description: project.description || "",
            status: project.status
        });
        setErrors({});
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setForm({ name: "", description: "", status: "active" });
        setErrors({});
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ name: "", description: "", status: "active" });
        setErrors({});
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    return (
        <div className="ml-16 lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 min-h-screen bg-gray-50">
            <ToastContainer />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📁 Project Management</h2>
                    <button
                        onClick={handleCreate}
                        className="w-full sm:w-auto bg-blue-600 text-white font-medium px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        + Create Project
                    </button>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                <ProjectFormModal
                    isOpen={showForm}
                    onClose={handleCancel}
                    onSubmit={handleSubmit}
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    editingId={editingId}
                />

                <DeleteConfirmModal
                    isOpen={!!deleteProject}
                    onClose={() => {
                        setDeleteProject(null);
                        setDeleteImages(false);
                    }}
                    onConfirm={confirmDelete}
                    project={deleteProject}
                    deleteImages={deleteImages}
                    setDeleteImages={setDeleteImages}
                />

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-3 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Images</th>
                                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((project) => (
                                    <ProjectTableRow
                                        key={project.id}
                                        project={project}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {currentItems.length === 0 && (
                        <div className="p-6 text-center text-gray-500 text-sm sm:text-base">
                            {searchTerm 
                                ? "No projects found matching your search." 
                                : "No projects found. Create your first project!"}
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={filteredProjects.length}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProjectManagement;