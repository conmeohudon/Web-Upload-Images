import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projectService } from "../../services/projectService.js";
import ProjectFormModal from "../../components/common/ProjectFormModal.jsx";
import DeleteConfirmProjectModal from "../../components/common/DeleteConfirmProjectModal.jsx";
import Pagination from "../../components/common/Pagination.jsx";


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

                <DeleteConfirmProjectModal
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