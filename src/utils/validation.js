// Validate file
export const validateFile = (file, maxSize = 5 * 1024 * 1024) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
        return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB` };
    }
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'File type not supported. Only JPG, PNG, GIF allowed.' };
    }
    return { valid: true };
};