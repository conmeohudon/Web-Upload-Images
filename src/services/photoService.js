import axios from "axios";
import { FALLBACK_BASE64, convertToBase64 } from "../utils/imageHelper";

const API_URL = "http://localhost:3004/photos";

export const photoService = {

    getAll: async () => {
        try {
            const response = await axios.get(API_URL);

            return response.data.map(photo => ({
                ...photo,
                fileUrl: photo.fileUrl?.startsWith("data:image")
                    ? photo.fileUrl
                    : FALLBACK_BASE64
            }));
        } catch (error) {
            console.error("Error in photoService.getAll:", error);
            return [];
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            const photo = response.data;

            return {
                ...photo,
                fileUrl: photo.fileUrl?.startsWith("data:image")
                    ? photo.fileUrl
                    : FALLBACK_BASE64
            };
        } catch (error) {
            console.error("Error in photoService.getById:", error);
            throw error;
        }
    },

    getByProjectId: async (projectId) => {
        try {
            const response = await axios.get(API_URL);
            const photos = response.data.filter(
                p => parseInt(p.projectId) === parseInt(projectId)
            );

            return photos.map(photo => ({
                ...photo,
                fileUrl: photo.fileUrl?.startsWith("data:image")
                    ? photo.fileUrl
                    : FALLBACK_BASE64
            }));
        } catch (error) {
            console.error("Error in photoService.getByProjectId:", error);
            return [];
        }
    },

    // ✔ CREATE – Tự convert file sang base64 nếu user upload file
    create: async (photoData) => {
        try {
            let base64 = photoData.fileUrl;

            // Nếu file là File object → convert
            if (photoData.file instanceof File) {
                base64 = await convertToBase64(photoData.file);
            }

            const newPhoto = {
                ...photoData,
                fileUrl: base64 || FALLBACK_BASE64,
                uploadedAt: new Date().toISOString()
            };

            const response = await axios.post(API_URL, newPhoto);
            return response.data;
        } catch (error) {
            console.error("Error in photoService.create:", error);
            throw error;
        }
    },

    // ✔ UPDATE – cũng convert nếu có file mới
    update: async (id, photoData) => {
        try {
            let base64 = photoData.fileUrl;

            if (photoData.file instanceof File) {
                base64 = await convertToBase64(photoData.file);
            }

            const safeData = {
                ...photoData,
                fileUrl: base64 || FALLBACK_BASE64
            };

            const response = await axios.patch(`${API_URL}/${id}`, safeData);
            return response.data;
        } catch (error) {
            console.error("Error in photoService.update:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error in photoService.delete:", error);
            throw error;
        }
    },

    deleteByProjectId: async (projectId) => {
        try {
            const photos = await photoService.getByProjectId(projectId);

            await Promise.all(
                photos.map(photo =>
                    axios.delete(`${API_URL}/${photo.id}`)
                )
            );

            return photos.length;
        } catch (error) {
            console.error("Error in photoService.deleteByProjectId:", error);
            throw error;
        }
    }
};
