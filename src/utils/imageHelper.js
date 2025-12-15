// Fallback base64 image (1x1 pixel transparent)
export const FALLBACK_BASE64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axkLYwAAAAASUVORK5CYII=";

// Convert File → Base64
export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Error converting file to base64");
        reader.readAsDataURL(file);
    });
};
