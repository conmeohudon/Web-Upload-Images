import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, X, ChevronDown } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../../services/projectService.js";
import { useImageUpload } from "../../hooks/useImageUpload.js";

function ImageUpload() {
    const { projectId: urlProjectId } = useParams();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);

    const {
        uploading,
        uploadProgress,
        processFiles,
        uploadMultipleImages,
        cleanupPreviews
    } = useImageUpload();

    const [files, setFiles] = useState([]);
    const [currentTagInput, setCurrentTagInput] = useState({});
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Load all projects
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectService.getAll();
                setProjects(data);

                // Set selected project from URL
                if (urlProjectId) {
                    const project = data.find(p => p.id === urlProjectId || p.id === parseInt(urlProjectId));
                    if (project) {
                        setSelectedProject(project);
                    }
                }
            } catch (error) {
                console.error("Error loading projects:", error);
                toast.error('Failed to load projects. Please try again.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        loadProjects();
    }, [urlProjectId]);

    // Change project
    const handleChangeProject = (project) => {
        setSelectedProject(project);
        setShowProjectDropdown(false);
        navigate(`/imageupload/${project.id}`);
        
        toast.info(`📁 Project changed to "${project.name}"`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    // DRAG
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const processed = await processFiles(droppedFiles);
        setFiles(prev => [...prev, ...processed]);
        
        if (processed.length > 0) {
            const validCount = processed.filter(f => f.status === 'valid').length;
            if (validCount > 0) {
                toast.success(`Added ${validCount} file(s) successfully`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
            if (processed.length > validCount) {
                toast.warning(`${processed.length - validCount} file(s) were invalid`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    };

    // SELECT FILE
    const handleFileInput = async (e) => {
        if (e.target.files) {
            const selected = Array.from(e.target.files);
            const processed = await processFiles(selected);
            setFiles(prev => [...prev, ...processed]);
            
            if (processed.length > 0) {
                const validCount = processed.filter(f => f.status === 'valid').length;
                if (validCount > 0) {
                    toast.success(`Added ${validCount} file(s) successfully`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
                if (processed.length > validCount) {
                    toast.warning(`${processed.length - validCount} file(s) were invalid`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
        }
    };

    // REMOVE FILE
    const removeFile = (id) => {
        const found = files.find(f => f.id === id);
        if (found?.preview) URL.revokeObjectURL(found.preview);
        setFiles(prev => prev.filter(f => f.id !== id));
        
        toast.info('🗑️ File removed', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    // UPDATE FIELDS
    const updateFileField = (id, field, value) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    // TAGS
    const addTag = (fileId) => {
        const tag = currentTagInput[fileId]?.trim();
        if (!tag) return;

        setFiles(prev => prev.map(f =>
            f.id === fileId && !f.tags.includes(tag)
                ? { ...f, tags: [...f.tags, tag] }
                : f
        ));

        setCurrentTagInput(prev => ({ ...prev, [fileId]: "" }));
    };

    const removeTag = (fileId, tag) => {
        setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, tags: f.tags.filter(t => t !== tag) } : f
        ));
    };

    const handleTagKeyDown = (e, fileId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(fileId);
        }
    };

    // UPLOAD
    const handleUpload = async () => {
        if (!selectedProject) {
            toast.error('Please select a project first!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        const validFiles = files.filter(f => f.status === 'valid');
        if (validFiles.length === 0) {
            toast.error('No valid files to upload!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        const results = await uploadMultipleImages(validFiles, selectedProject.id);

        if (results.successful.length > 0 && results.failed.length === 0) {
            toast.success(`Successfully uploaded ${results.successful.length} image(s)!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if (results.successful.length > 0 && results.failed.length > 0) {
            toast.warning(`Uploaded: ${results.successful.length} | Failed: ${results.failed.length}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if (results.failed.length > 0) {
            toast.error(`Failed to upload ${results.failed.length} image(s)`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

        if (results.successful.length > 0) {
            clearAll();
        }
    };

    // CLEAR
    const clearAll = () => {
        cleanupPreviews(files);
        setFiles([]);
        setCurrentTagInput({});
    };

    return (
        <div className="ml-16 lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 min-h-screen bg-gray-50">
            <ToastContainer />
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Upload Images</h2>

                        {/* Project Selector */}
                        <div className="relative inline-block w-full sm:w-auto">
                            <button
                                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors w-full sm:w-auto justify-between"
                            >
                                <span className="font-medium text-gray-900 truncate">
                                    {selectedProject ? selectedProject.name : "Select a project"}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${showProjectDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {showProjectDropdown && (
                                <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-80 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                                    {projects.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No projects available
                                        </div>
                                    ) : (
                                        projects.map((project) => (
                                            <button
                                                key={project.id}
                                                onClick={() => handleChangeProject(project)}
                                                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                                    selectedProject?.id === project.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                                }`}
                                            >
                                                <div className="font-medium text-gray-900">{project.name}</div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {project.description || "No description"}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {project.imageCount || 0} images
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/projectselection')}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="hidden sm:inline">Back to Projects</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-2">
                    {/* Upload Area */}
                    <div>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    Drag & Drop files here
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-6">
                                    Maximum file size: 5MB<br />
                                    Supported formats: JPG, PNG, GIF<br />
                                    Or click to browse files
                                </p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Upload Stats */}
                        {files.length > 0 && (
                            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Upload Summary</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Files</p>
                                        <p className="text-xl sm:text-2xl font-bold text-blue-900">{files.length}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-xs sm:text-sm text-green-600 font-medium">Valid Files</p>
                                        <p className="text-xl sm:text-2xl font-bold text-green-900">
                                            {files.filter(f => f.status === 'valid').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Area */}
                    <div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                Image Previews ({files.length})
                            </h3>

                            {files.length === 0 ? (
                                <div className="text-center py-8 sm:py-12">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-500">No files uploaded yet</p>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        Upload files to see them here
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 max-h-[60vh] lg:max-h-[600px] overflow-y-auto pr-2">
                                        {files.map((file) => (
                                            <div key={file.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                    <div className="w-full h-48 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={file.preview}
                                                            alt={file.file.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm sm:text-base font-medium text-gray-900 truncate" title={file.file.name}>
                                                                    {file.file.name}
                                                                </p>
                                                                <p className="text-xs sm:text-sm text-gray-600">
                                                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFile(file.id)}
                                                                className="text-gray-400 hover:text-red-600 ml-2 transition-colors"
                                                            >
                                                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                                            </button>
                                                        </div>
                                                        {file.status === 'valid' ? (
                                                            <p className="text-xs sm:text-sm text-green-600 flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                Valid
                                                            </p>
                                                        ) : (
                                                            <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                                {file.error}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {file.status === 'valid' && (
                                                    <div className="mt-4 space-y-3">
                                                        <div>
                                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                                Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={file.title}
                                                                onChange={(e) => updateFileField(file.id, 'title', e.target.value)}
                                                                placeholder="e.g., 'Initial concept sketches'"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                                Description
                                                            </label>
                                                            <textarea
                                                                value={file.description}
                                                                onChange={(e) => updateFileField(file.id, 'description', e.target.value)}
                                                                placeholder="A brief description of the image"
                                                                rows={2}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                                Tags
                                                            </label>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {file.tags.map((tag, index) => (
                                                                    <span
                                                                        key={`${tag}-${index}`}
                                                                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                                                    >
                                                                        #{tag}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeTag(file.id, tag)}
                                                                            className="hover:text-blue-900"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={currentTagInput[file.id] || ''}
                                                                    onChange={(e) => setCurrentTagInput({ ...currentTagInput, [file.id]: e.target.value })}
                                                                    onKeyDown={(e) => handleTagKeyDown(e, file.id)}
                                                                    placeholder="Type and press Enter"
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addTag(file.id)}
                                                                    className="px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex-shrink-0"
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* PROGRESS BAR */}
                                    {uploading && (
                                        <div className="mt-4">
                                            <p className="text-xs sm:text-sm mb-1 text-gray-700">
                                                Uploading... {uploadProgress}%
                                            </p>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                        <button
                                            onClick={clearAll}
                                            disabled={uploading}
                                            className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading || !selectedProject || files.filter(f => f.status === 'valid').length === 0}
                                            className="w-full sm:flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            {uploading
                                                ? `Uploading... ${uploadProgress}%`
                                                : `Upload ${files.filter(f => f.status === 'valid').length} Images`
                                            }
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;