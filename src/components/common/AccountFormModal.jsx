import React from "react";

function AccountFormModal({ 
    show, 
    form, 
    editingId, 
    setForm, 
    onSubmit, 
    onCancel 
}) {
    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingId ? "Update Account" : "Create New Account"}
                </h3>

                <form onSubmit={onSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Username"
                        className="block w-full px-4 py-2 border rounded-lg"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />

                    {!editingId && (
                        <input
                            type="email"
                            placeholder="Email"
                            className="block w-full px-4 py-2 border rounded-lg"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="block w-full px-4 py-2 border rounded-lg"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    <select
                        className="block w-full px-4 py-2 border rounded-lg"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        required
                    >
                        <option value="">Select role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    {editingId && (
                        <select
                            className="block w-full px-4 py-2 border rounded-lg"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                        >
                            {editingId ? "Save Changes" : "Create"}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AccountFormModal;
