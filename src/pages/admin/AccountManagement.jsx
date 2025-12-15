import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { accountService } from "../../services/accountService.js";

// Component Modal Wrapper
function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    
    return (
        <div 
            className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

// Component Form Input
function FormInput({ label, error, required, ...props }) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm sm:text-base ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

// Component Form Select
function FormSelect({ label, error, required, children, ...props }) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className={`block w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white text-sm sm:text-base ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

// Component Account Form Modal
function AccountFormModal({ isOpen, onClose, onSubmit, form, setForm, errors, editingId }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                {editingId ? "Update Account" : "Create New Account"}
            </h3>
            
            {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {errors.submit}
                </div>
            )}

            <div className="space-y-3 sm:space-y-4">
                <FormInput
                    label="Username"
                    required
                    type="text"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    error={errors.username}
                />

                {!editingId && (
                    <FormInput
                        label="Email"
                        required
                        type="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        error={errors.email}
                    />
                )}

                <FormInput
                    label="Password"
                    required
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    error={errors.password}
                />

                <FormSelect
                    label="Role"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    error={errors.role}
                >
                    <option value="">Select a role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </FormSelect>

                <FormSelect
                    label="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </FormSelect>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={onSubmit}
                        className="flex-1 bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        {editingId ? "Save Changes" : "Create Account"}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-400 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// Component Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Confirm Delete
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
                Bạn có chắc muốn xóa tài khoản này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-red-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                    Delete
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 bg-gray-400 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

// Component Search and Filter Bar
function SearchFilterBar({ searchTerm, setSearchTerm, filterRole, setFilterRole }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="w-full sm:w-48">
                    <select
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

// Component Account Table Row
function AccountTableRow({ account, currentUserId, onEdit, onDelete }) {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{account.id}</td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">{account.username}</td>
            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">{account.email || '-'}</td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                }`}>
                    {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                </span>
            </td>
            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(account.status)}`}>
                    {account.status ? account.status.charAt(0).toUpperCase() + account.status.slice(1) : 'N/A'}
                </span>
            </td>
            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(account.createdAt || account.createdat)}
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                <div className="flex justify-end gap-2 sm:gap-3">
                    <button
                        onClick={() => onEdit(account)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded-md hover:bg-indigo-50 transition-colors text-xs sm:text-sm"
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(account.id)}
                        className={`p-1 sm:p-2 rounded-md transition-colors text-xs sm:text-sm ${
                            account.id === currentUserId 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                        }`}
                        title={account.id === currentUserId ? "Cannot delete current user" : "Delete"}
                        disabled={account.id === currentUserId}
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

// Component Pagination
function Pagination({ currentPage, totalPages, indexOfFirstItem, indexOfLastItem, totalItems, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span>{' '}
                of <span className="font-medium">{totalItems}</span> results
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Prev
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                            currentPage === index + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// Main Component
function AccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
        status: "active"
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [currentUserId] = useState(1);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const loadAccounts = async () => {
        const data = await accountService.getAll();
        setAccounts(data);
        setFilteredAccounts(data);
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    useEffect(() => {
        let result = accounts;

        if (filterRole !== "all") {
            result = result.filter(acc => acc.role === filterRole);
        }

        if (searchTerm) {
            result = result.filter(acc => 
                acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (acc.email && acc.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredAccounts(result);
        setCurrentPage(1);
    }, [searchTerm, filterRole, accounts]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "Username is required";
        } else if (form.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!editingId) {
            if (!form.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                newErrors.email = "Invalid email format";
            }
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!form.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (editingId) {
                await accountService.update(editingId, form);
                toast.success('Account updated successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                await accountService.create(form);
                toast.success('Account created successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            setForm({ username: "", email: "", password: "", role: "", status: "active" });
            setErrors({});
            setShowForm(false);
            setEditingId(null);
            loadAccounts();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error('An error occurred. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setErrors({ submit: "An error occurred. Please try again." });
        }
    };

    const handleDelete = async (id) => {
        if (id === currentUserId) {
            toast.warning('You cannot delete the currently logged-in account!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        try {
            await accountService.delete(deleteId);
            toast.success('Account deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setDeleteId(null);
            loadAccounts();
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error('Failed to delete account. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleEdit = (acc) => {
        setEditingId(acc.id);
        setForm({
            username: acc.username,
            email: acc.email,
            password: acc.password,
            role: acc.role,
            status: acc.status
        });
        setErrors({});
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setForm({ username: "", email: "", password: "", role: "", status: "active" });
        setErrors({});
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ username: "", email: "", password: "", role: "", status: "active" });
        setErrors({});
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

    return (
        <div className="ml-16 lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 min-h-screen bg-gray-50">
            <ToastContainer />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">👤 Account Management</h2>
                    <button
                        onClick={handleCreate}
                        className="w-full sm:w-auto bg-blue-600 text-white font-medium px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        + Create Account
                    </button>
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterRole={filterRole}
                    setFilterRole={setFilterRole}
                />

                <AccountFormModal
                    isOpen={showForm}
                    onClose={handleCancel}
                    onSubmit={handleSubmit}
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    editingId={editingId}
                />

                <DeleteConfirmModal
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onConfirm={confirmDelete}
                />

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((acc) => (
                                    <AccountTableRow
                                        key={acc.id}
                                        account={acc}
                                        currentUserId={currentUserId}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {currentItems.length === 0 && (
                        <div className="p-6 text-center text-gray-500 text-sm sm:text-base">
                            {searchTerm || filterRole !== "all" 
                                ? "No accounts found matching your filters." 
                                : "No accounts found."}
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={filteredAccounts.length}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default AccountManagement;