import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { accountService } from '../services/accountService';
import { Eye, EyeOff } from 'lucide-react';


export const Login = () => {

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // GỌI API ĐỂ TÌM KIẾM USER: JSON Server trả về [user] nếu khớp, hoặc []
            const foundAccounts = await accountService.authenticate(
                credentials.username, 
                credentials.password
            );
            
            // Lấy đối tượng user tìm thấy (phần tử đầu tiên)
            const user = foundAccounts[0]; 

            if (user) {
                login(user); 
                
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'user') {
                    navigate('/projectselection');
                } else {
                    setError('Vai trò người dùng không hợp lệ.');
                    logout(); 
                }
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng');
            }
        } catch (err) {
            console.error(err);
            setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid min-h-screen place-content-center bg-gray-100 px-4 py-8 md:px-8 md:py-12'>
            <div className="container w-full max-w-4xl rounded-xl bg-white shadow-2xl md:grid md:grid-cols-2 overflow-hidden">
                
                <form 
                    onSubmit={handleSubmit} 
                    className="mx-auto grid w-full max-w-[340px] place-content-center gap-2 p-6 md:p-8" 
                >
                    
                    {error && (
                        <p className="rounded-md bg-red-100 p-2 text-center text-red-700 text-sm mb-3">
                            {error}
                        </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">

                        <h2 className="text-3xl font-bold">Project Upload</h2>
                    </div>

                    <h2 className='text-2xl font-bold text-gray-800 pt-1'>Welcome Back!👋</h2>
                    <p className='pt-0 pb-4 text-slate-500 text-sm'>Log in to access your project dashboard</p>

                    <div className="space-y-1 mb-4">
                        <label htmlFor="username-input" className='block font-medium text-gray-700 text-sm'>Username/Email</label>
                        <input 
                            id="username-input"
                            type="text" 
                            name='username'
                            className={"w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"} 
                            placeholder='Tên đăng nhập'
                            value={credentials.username}
                            onChange={handleInputChanges}
                            required
                        />
                    </div>

                    <div className="space-y-1 mb-4">
                        <label htmlFor="password-input" className='block font-medium text-gray-700 text-sm'>Password</label>
                        <div className="relative">
                            <input 
                                id="password-input"
                                type={showPassword ? "text" : "password"}
                                className={"w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"} 
                                placeholder='******'
                                name='password'
                                value={credentials.password}
                                onChange={handleInputChanges}
                                required
                                autoComplete='current-password'
                            />

                            <button 
                                type='button' 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer" 
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-600 disabled:opacity-50 mt-1 mb-2 cursor-pointer" 
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <p className="text-center text-gray-600 pt-1 text-xs">
                        Don’t have an account? {" "}
                        <a href="#" className={"text-blue-500 hover:underline font-medium"}>Đăng ký</a>
                    </p>

                    <div className="my-3 flex items-center gap-3">
                        <span className="h-[1px] w-full bg-gray-300"></span>
                        <p className='text-xs text-gray-500'>Hoặc</p>
                        <span className="h-[1px] w-full bg-gray-300"></span>
                    </div>

                    <div className="flex justify-center gap-4 mb-2">
                        <button type='button' className="p-1 border rounded-full hover:bg-gray-50 transition">
                            <img src="/images/google-logo.svg" alt="Google" width={20} height={20} /> 
                        </button>
                        <button type='button' className="p-1 border rounded-full hover:bg-gray-50 transition">
                            <img src="/images/apple-logo.svg" alt="Apple" width={20} height={20} />
                        </button>
                        <button type='button' className="p-1 border rounded-full hover:bg-gray-50 transition">
                            <img src="/images/facebook-logo.svg" alt="Facebook" width={20} height={20} />
                        </button>
                    </div>

                </form>

                <div className="relative hidden bg-blue-500 md:block">
                    <img 
                        src="/images/form-banner.png" 
                        alt="form banner"
                        className='h-full w-full object-cover opacity-70' 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`mx-8 max-w-xs bg-black/30 p-5 rounded-lg text-white backdrop-blur-sm`}>
                            <h2 className='mb-3 text-xl font-semibold'>Quản lý ảnh dự án hiệu quả</h2>
                            <p className='text-xs'>Tải lên, tổ chức và chia sẻ hình ảnh của bạn với cộng đồng làm việc.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}