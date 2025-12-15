import { useState } from 'react';
import { photoService } from '../services/photoService';
import { useAuth } from '../contexts/AuthContext';
import { convertToBase64 } from '../utils/imageHelper';
import { validateFile } from '../utils/validation';

export const useImageUpload = () => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);


    // Upload single image
    const uploadSingleImage = async (fileData, projectId) => {
        try {
            const photoData = {
                projectId: projectId,
                userId: user?.id,
                title: fileData.title,
                description: fileData.description,
                fileName: fileData.fileName,
                fileUrl: fileData.base64,
                fileSize: fileData.fileSize,
                tags: fileData.tags,
            };

            const result = await photoService.create(photoData);
            return { success: true, data: result };
        } catch (err) {
            console.error('Error uploading image:', err);
            return { success: false, error: err.message };
        }
    };

    // Upload multiple images
    const uploadMultipleImages = async (files, projectId) => {
        setUploading(true);
        setError(null);
        setUploadProgress(0);

        const results = {
            successful: [],
            failed: []
        };

        try {
            const validFiles = files.filter(f => f.status === 'valid');
            const totalFiles = validFiles.length;

            for (let i = 0; i < validFiles.length; i++) {
                const file = validFiles[i];
                
                const result = await uploadSingleImage({
                    title: file.title,
                    description: file.description,
                    fileName: file.file.name,
                    base64: file.base64,
                    fileSize: file.file.size,
                    tags: file.tags,
                }, projectId);

                if (result.success) {
                    results.successful.push({ file: file.file.name, data: result.data });
                } else {
                    results.failed.push({ file: file.file.name, error: result.error });
                }

                // Update progress
                setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
            }

            return results;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Process files (validate and convert to base64)
    const processFiles = async (fileList) => {
        const processedFiles = await Promise.all(
            Array.from(fileList).map(async (file) => {
                const validation = validateFile(file);
                const base64 = validation.valid ? await convertToBase64(file) : null;
                
                // Auto-fill title from filename (remove extension)
                const fileName = file.name;
                const titleWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
                
                return {
                    id: Math.random().toString(36).substring(7),
                    file,
                    title: titleWithoutExt,
                    description: '',
                    tags: [],
                    preview: URL.createObjectURL(file),
                    base64: base64,
                    status: validation.valid ? 'valid' : 'invalid',
                    error: validation.error,
                };
            })
        );

        return processedFiles;
    };

    // Cleanup preview URLs
    const cleanupPreviews = (files) => {
        files.forEach(f => {
            if (f.preview) {
                URL.revokeObjectURL(f.preview);
            }
        });
    };

    return {
        uploading,
        uploadProgress,
        error,
        validateFile,
        uploadSingleImage,
        uploadMultipleImages,
        processFiles,
        cleanupPreviews,
    };
};