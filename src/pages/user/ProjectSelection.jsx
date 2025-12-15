import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../../services/projectService.js";
import { photoService } from "../../services/photoService.js";

function ProjectSelection() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, [sortBy]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const [projectsData, photosData] = await Promise.all([
                projectService.getAll(),
                photoService.getAll()
            ]);

            let data = projectsData.map(project => {
                const projectPhotos = photosData.filter(photo =>
                    parseInt(photo.projectId) === parseInt(project.id)
                );

                return {
                    ...project,
                    thumbnailUrl: projectPhotos[0]?.fileUrl || null,
                    imageCount: projectPhotos.length
                };
            });

            switch (sortBy) {
                case "created_at":
                    data.sort((a, b) => new Date(b.createdAt || b.createdat) - new Date(a.createdAt || a.createdat));
                    break;
                case "updated_at":
                    data.sort((a, b) => new Date(b.updatedAt || b.updatedat) - new Date(a.updatedAt || a.updatedat));
                    break;
                case "name":
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    break;
            }

            setProjects(data);
        } catch (error) {
            console.error("Error loading projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSelectProject = (project) => {
        console.log("Selected project:", project);
        navigate(`/imageupload/${project.id}`);
    };

    return (
        <div className="ml-16 lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-6 lg:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select a Project</h2>
                    <p className="text-sm sm:text-base text-gray-600">Choose a project below to start uploading your images.</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3 sm:gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Sort and Filter Controls */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                            <span className="text-sm text-gray-700 hidden sm:inline">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                            >
                                <option value="created_at">Date Created</option>
                                <option value="updated_at">Date Updated</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading projects...</p>
                    </div>
                ) : (
                    <>
                        {/* Projects Grid */}
                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📁</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm ? "No Projects Found" : "No Projects Yet"}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm
                                        ? "Try adjusting your search terms."
                                        : "Create your first project to get started."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                                    >
                                        {/* Project Thumbnail */}
                                        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex items-center justify-center">
                                            {project.thumbnailUrl || project.thumbnail_url ? (
                                                <img
                                                    src={project.thumbnailUrl || project.thumbnail_url}
                                                    alt={project.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<div class="flex flex-col items-center justify-center w-full h-full text-gray-400"><svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span class="text-sm">No Image</span></div>';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Project Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 truncate" title={project.name}>
                                                {project.name}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
                                                {project.description || "No description available"}
                                            </p>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 mb-4 gap-2">
                                                <span className="truncate">Created: {formatDate(project.createdAt || project.createdat)}</span>
                                                <span className={`px-2 py-1 rounded-full whitespace-nowrap ${project.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {project.status || 'active'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleSelectProject(project)}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Select Project
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Results Count */}
                        {filteredProjects.length > 0 && (
                            <div className="mt-6 text-center text-sm text-gray-600">
                                Showing {filteredProjects.length} of {projects.length} projects
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProjectSelection;