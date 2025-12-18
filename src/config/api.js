
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

let DEV_URL, PROD_URL, NODE_ENV;

try {
  DEV_URL = process.env.REACT_APP_API_URL_DEV;
  PROD_URL = process.env.REACT_APP_API_URL_PROD;
  NODE_ENV = process.env.NODE_ENV;
} catch (e) {
  // Fallback nếu process không tồn tại
  DEV_URL = 'http://localhost:3004';
  PROD_URL = 'https://json-server-backend-2-oop0.onrender.com';
  NODE_ENV = 'production';
}

export const API_BASE_URL = PROD_URL;

// API Endpoints
export const API_ENDPOINTS = {
  accounts: `${API_BASE_URL}/accounts`,
  projects: `${API_BASE_URL}/projects`,
  photos: `${API_BASE_URL}/photos`
};

// Log để debug
if (NODE_ENV === 'development') {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🏠 Is Localhost:', isLocalhost);
}