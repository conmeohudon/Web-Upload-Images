import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Filter, Calendar, Folder, X, ChevronLeft, ChevronRight, Download, Trash2, Info } from "lucide-react";
import { photoService } from "../../services/photoService.js";
import { projectService } from "../../services/projectService.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

function Gallery() {
    const { user } = useAuth();
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Lightbox
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    // Delete modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [photosData, projectsData] = await Promise.all([
                photoService.getAll(),
                projectService.getAll()
            ]);

            // Debug: Check if base64 is complete
            if (photosData.length > 0) {
                const firstPhoto = photosData[0];
                console.log('Photo loaded:', {
                    id: firstPhoto.id,
                    title: firstPhoto.title,
                    fileName: firstPhoto.fileName,
                    fileUrlLength: firstPhoto.fileUrl?.length,
                    isValidFormat: firstPhoto.fileUrl?.startsWith('data:image'),
                    preview: firstPhoto.fileUrl?.substring(0, 30) + '...'
                });
            }

            setImages(photosData);
            setProjects(projectsData);
        } catch (error) {
            console.error("Error loading gallery:", error);
            toast.error('Failed to load images. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort
    useEffect(() => {
        let result = [...images];

        // Filter by search term
        if (searchTerm) {
            result = result.filter(img =>
                (img.title && img.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (img.tags && img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }

        // Filter by project
        if (selectedProject !== "all") {
            result = result.filter(img => parseInt(img.projectId) === parseInt(selectedProject));
        }

        // Sort
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
                break;
            case "name":
                result.sort((a, b) => (a.title || a.fileName).localeCompare(b.title || b.fileName));
                break;
            default:
                break;
        }

        setFilteredImages(result);
    }, [searchTerm, selectedProject, sortBy, images]);

    const getProjectName = (projectId) => {
        const project = projects.find(p => parseInt(p.id) === parseInt(projectId));
        return project ? project.name : "Unknown Project";
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '-';
        const kb = bytes / 1024;
        const mb = kb / 1024;
        if (mb >= 1) return `${mb.toFixed(2)} MB`;
        return `${kb.toFixed(2)} KB`;
    };

    // Lightbox functions
    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        setShowInfo(false);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setShowInfo(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    const handleKeyDown = (e) => {
        if (!lightboxOpen) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen]);

    // Download image
    const downloadImage = (image) => {
        const link = document.createElement('a');
        link.href = image.fileUrl;
        link.download = image.fileName || 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Image downloaded successfully!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    // Delete functions
    const handleDeleteClick = (image) => {
        setImageToDelete(image);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await photoService.delete(imageToDelete.id);
            setImages(images.filter(img => img.id !== imageToDelete.id));
            setDeleteModalOpen(false);
            setImageToDelete(null);
            if (lightboxOpen) {
                closeLightbox();
            }
            
            toast.success('Image deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error('Failed to delete image. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const canDelete = (image) => {
        return user?.role === 'admin' || parseInt(image.userId) === parseInt(user?.id);
    };

    const currentImage = filteredImages[currentImageIndex];

    return (
        <div className="ml-16 lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 min-h-screen bg-gray-50">
            <ToastContainer />
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🖼️ Image Gallery</h2>
                    <p className="text-sm sm:text-base text-gray-600">Browse and manage your uploaded images</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Search */}
                        <div className="sm:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search images..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Project Filter */}
                        <div>
                            <div className="relative">
                                <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm sm:text-base"
                                >
                                    <option value="all">All Projects</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm sm:text-base"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-3 text-xs sm:text-sm text-gray-600">
                        Showing {filteredImages.length} of {images.length} images
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading images...</p>
                    </div>
                ) : (
                    <>
                        {/* Empty State */}
                        {filteredImages.length === 0 ? (
                            <div className="text-center py-12 sm:py-20 bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="text-4xl sm:text-6xl mb-4">📷</div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm || selectedProject !== "all"
                                        ? "No images found"
                                        : "No images yet"}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                                    {searchTerm || selectedProject !== "all"
                                        ? "Try adjusting your filters"
                                        : "Upload your first image to get started"}
                                </p>
                                {!searchTerm && selectedProject === "all" && (
                                    <button
                                        onClick={() => window.location.href = '/imageupload'}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                                    >
                                        Upload Images
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* Gallery Grid */
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                                {filteredImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className="relative bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                        onClick={() => openLightbox(index)}
                                    >
                                        {/* Image */}
                                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                                            <img
                                                src={image.fileUrl}
                                                alt={image.title || image.fileName}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />

                                            {/* Hover Overlay with Info */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute inset-0 p-2 sm:p-3 lg:p-4 flex flex-col justify-end text-white">
                                                    {/* Title */}
                                                    <h3 className="font-bold text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 line-clamp-2">
                                                        {image.title || image.fileName}
                                                    </h3>

                                                    {/* Project - Hidden on mobile */}
                                                    <div className="hidden sm:flex items-center gap-2 mb-2">
                                                        <Folder className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="text-xs sm:text-sm truncate">{getProjectName(image.projectId)}</span>
                                                    </div>

                                                    {/* Description - Hidden on mobile */}
                                                    {image.description && (
                                                        <p className="hidden sm:block text-xs sm:text-sm text-gray-200 line-clamp-2 mb-2">
                                                            {image.description}
                                                        </p>
                                                    )}

                                                    {/* Tags - Show less on mobile */}
                                                    {image.tags && image.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {image.tags.slice(0, 2).map((tag, i) => (
                                                                <span key={i} className="px-1.5 sm:px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                            {image.tags.length > 2 && (
                                                                <span className="px-1.5 sm:px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                                    +{image.tags.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Bottom Info - Simplified on mobile */}
                                                    <div className="flex items-center justify-between text-xs text-gray-300 pt-1 sm:pt-2 border-t border-white/20">
                                                        <span className="hidden sm:flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(image.uploadedAt)}
                                                        </span>
                                                        <span className="text-xs">{formatFileSize(image.fileSize)}</span>
                                                    </div>

                                                    {/* Delete Button */}
                                                    {canDelete(image) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(image);
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Lightbox Modal */}
                {lightboxOpen && currentImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <X className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>

                        {/* Download button */}
                        <button
                            onClick={() => downloadImage(currentImage)}
                            className="absolute top-2 sm:top-4 right-12 sm:right-16 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <Download className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>

                        {/* Delete button */}
                        {canDelete(currentImage) && (
                            <button
                                onClick={() => handleDeleteClick(currentImage)}
                                className="absolute top-2 sm:top-4 right-24 sm:right-28 text-red-500 hover:text-red-400 transition-colors z-10"
                            >
                                <Trash2 className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        )}

                        {/* Navigation */}
                        {filteredImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-1.5 sm:p-2 bg-black bg-opacity-50 rounded-full"
                                >
                                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-1.5 sm:p-2 bg-black bg-opacity-50 rounded-full"
                                >
                                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <div className="w-full h-full flex items-center justify-center p-4 sm:p-0">
                            <img
                                src={currentImage.fileUrl}
                                alt={currentImage.title || currentImage.fileName}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    console.error('Lightbox image error:', currentImage.fileName);
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23333" width="800" height="600"/%3E%3Ctext fill="%23fff" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                            {currentImageIndex + 1} / {filteredImages.length}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && imageToDelete && (
                    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                                Delete Image
                            </h3>

                            <div className="mb-4">
                                <img
                                    src={imageToDelete.fileUrl}
                                    alt={imageToDelete.title}
                                    className="w-full h-32 sm:h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f0f0f0" width="400" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" dy="10.5" x="50%25" y="50%25" text-anchor="middle"%3EPreview Not Available%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>

                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                Are you sure you want to delete "<strong>{imageToDelete.title || imageToDelete.fileName}</strong>"? This action cannot be undone.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setImageToDelete(null);
                                    }}
                                    className="flex-1 bg-gray-400 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Gallery;