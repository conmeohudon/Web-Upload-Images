import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute } from './routes/AdminRoute';
import ProjectSelection from './pages/user/ProjectSelection';
import { Login } from './pages/Login';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AccountManagement from './pages/admin/AccountManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import AllImagesView from './pages/admin/AllImagesView';
import Dashboard from './pages/admin/Dashboard';
import ImageUpload from './pages/user/ImageUpload';
import Gallery from './pages/user/Gallery';

export const App = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    return (
            <AuthProvider>
                {!isLoginPage && <Header />}
                <div>
                    {!isLoginPage && <Sidebar />}
                    <main className="min-h-[80vh] bg-gray-50">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                        <Route path="/admin/accountmanagement" element={<AdminRoute><AccountManagement /></AdminRoute>} />
                        <Route path="/admin/projectmanagement" element={<AdminRoute><ProjectManagement /></AdminRoute>} />
                        <Route path="/admin/allimages" element={<AdminRoute><AllImagesView /></AdminRoute>} />
                        <Route path="/projectselection" element={<PrivateRoute><ProjectSelection /></PrivateRoute>} />
                        <Route path="/imageupload" element={<PrivateRoute><ImageUpload /></PrivateRoute>} />
                        <Route path="/imageupload/:projectId" element={<PrivateRoute><ImageUpload /></PrivateRoute>} />
                        <Route path="/gallery" element={<PrivateRoute><Gallery /></PrivateRoute>} />
                            
                        <Route path="*" element={<div className="text-center ml-64 mt-16 mb-20 p-8 text-red-500">404 - Trang không tồn tại</div>} />
                    </Routes>
                    {!isLoginPage && <Footer />}
                </main>
                </div>
                
            </AuthProvider>
    );
};
