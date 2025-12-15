import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra LocalStorage khi component khởi tạo
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Cập nhật state và LocalStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        // Xóa state và LocalStorage
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };
    
    const isAuthenticated = !!user; 
    
    const isAdmin = user?.role === 'admin'; 

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading,
            isAuthenticated, 
            isAdmin 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);