import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { accountService } from '../services/accountService';

export const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accounts = await accountService.getAll();
            const user = accounts.find(
                a => a.username === credentials.username &&
                    a.password === credentials.password &&
                    a.role === 'user'
            );
            if (user) {
                login(user);
                navigate('/');
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form 
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};
