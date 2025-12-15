import axios from 'axios';

const API_URL = 'http://localhost:3004/projects';
const PHOTOS_API_URL = 'http://localhost:3004/photos';

export const projectService = {
    getAll: async () => {
        try {
            const [projectsResponse, photosResponse] = await Promise.all([
                axios.get(API_URL),
                axios.get(PHOTOS_API_URL)
            ]);

            const projects = projectsResponse.data;
            const photos = photosResponse.data;

            // Tính số lượng ảnh cho mỗi project
            return projects.map(project => {
                const imageCount = photos.filter(photo => {
                    const photoProjectId = parseInt(photo.projectId);
                    const projectId = parseInt(project.id);
                    return photoProjectId === projectId;
                }).length;

                return {
                    ...project,
                    imageCount,
                    photoCount: imageCount // Alias for compatibility
                };
            });
        } catch (error) {
            console.error('Error in projectService.getAll:', error);
            // Fallback: return projects without image count
            try {
                const response = await axios.get(API_URL);
                return response.data.map(p => ({ ...p, imageCount: 0, photoCount: 0 }));
            } catch (err) {
                console.error('Fallback failed:', err);
                return [];
            }
        }
    },

    getById: async (id) => {
        try {
            const [projectResponse, photosResponse] = await Promise.all([
                axios.get(`${API_URL}/${id}`),
                axios.get(PHOTOS_API_URL)
            ]);

            const project = projectResponse.data;
            const photos = photosResponse.data;

            const imageCount = photos.filter(photo => {
                const photoProjectId = parseInt(photo.projectId);
                const projectId = parseInt(project.id);
                return photoProjectId === projectId;
            }).length;

            return {
                ...project,
                imageCount,
                photoCount: imageCount
            };
        } catch (error) {
            console.error('Error in projectService.getById:', error);
            // Fallback
            const response = await axios.get(`${API_URL}/${id}`);
            return { ...response.data, imageCount: 0, photoCount: 0 };
        }
    },

    create: async (projectData) => {
        const newProject = {
            ...projectData,
            createdAt: new Date().toISOString(),
            imageCount: 0,
            photoCount: 0
        };

        const response = await axios.post(API_URL, newProject);
        return response.data;
    },

    update: async (id, projectData) => {
        const response = await axios.patch(`${API_URL}/${id}`, projectData);
        return response.data;
    },

    delete: async (id, options = {}) => {
        const { deleteImages = false } = options;

        try {
            if (deleteImages) {
                // Lấy tất cả photos của project này
                const photosResponse = await axios.get(PHOTOS_API_URL);
                const projectPhotos = photosResponse.data.filter(photo => {
                    const photoProjectId = parseInt(photo.projectId);
                    const projectId = parseInt(id);
                    return photoProjectId === projectId;
                });

                // Xóa tất cả photos
                await Promise.all(
                    projectPhotos.map(photo => axios.delete(`${PHOTOS_API_URL}/${photo.id}`))
                );
            }

            // Xóa project
            await axios.delete(`${API_URL}/${id}`);
            return null;
        } catch (error) {
            console.error('Error in projectService.delete:', error);
            throw error;
        }
    }
};