import axios from 'axios';

// Đặt base URL của JSON Server
const API_URL = 'http://localhost:3004/accounts';

export const accountService = {
    getAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (accountData) => {
        const newAccount = {
            ...accountData,
            createdAt: new Date().toISOString()
        };
        // JSON Server tự động thêm ID và trả về đối tượng mới
        const response = await axios.post(API_URL, newAccount);
        return response.data;
    },

    update: async (id, accountData) => {
        const response = await axios.patch(`${API_URL}/${id}`, accountData);
        return response.data;
    },

    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return null;
    },

    authenticate: async (username, password) => {
        const response = await axios.get(
            `${API_URL}?username=${username}&password=${password}`
        );
        return response.data;
    }
};