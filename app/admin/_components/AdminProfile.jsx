'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AdminProfile() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newUsername: '',
        newPassword: ''
    });

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        try {
            const response = await fetch('/api/admin/profile');
            const data = await response.json();

            if (!response.ok) {
                // If unauthorized or admin not found, redirect to login
                if (response.status === 401 || response.status === 404) {
                    router.push('/admin/login');
                    return;
                }
                throw new Error(data.error || 'Failed to fetch profile');
            }

            setUsername(data.data.username);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error(error.message || 'Failed to load profile');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // If unauthorized or admin not found, redirect to login
                if (response.status === 401 || response.status === 404) {
                    router.push('/admin/login');
                    return;
                }
                throw new Error(data.error || 'Failed to update profile');
            }

            toast.success(data.message || 'Profile updated successfully');
            setIsModalOpen(false);
            setFormData({ currentPassword: '', newUsername: '', newPassword: '' });
            fetchAdminProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    return (
        <div className="mt-auto mb-4">
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg w-full"
            >
                <User size={20} />
                <motion.span
                    animate={{ opacity: true ? 1 : 0, width: true ? 'auto' : 0 }}
                    className="whitespace-nowrap"
                >
                    {username || 'Admin Profile'}
                </motion.span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) =>
                                            setFormData({ ...formData, currentPassword: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        New Username
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.newUsername}
                                        onChange={(e) =>
                                            setFormData({ ...formData, newUsername: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) =>
                                            setFormData({ ...formData, newPassword: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 