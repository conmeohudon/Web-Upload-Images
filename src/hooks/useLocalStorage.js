import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // State để lưu giá trị
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Lấy từ localStorage
            const item = window.localStorage.getItem(key);
            // Parse và return giá trị hoặc initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    // Return một wrapped version của useState's setter function
    const setValue = (value) => {
        try {
            // Cho phép value là một function giống useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            // Lưu state
            setStoredValue(valueToStore);
            
            // Lưu vào localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    // Xóa item khỏi localStorage
    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    };

    return [storedValue, setValue, removeValue];
};