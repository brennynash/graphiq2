'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Check,
    Image as ImageIcon,
    Upload,
    MoveUp,
    MoveDown
} from 'lucide-react';
import { toast } from 'sonner';

export default function MembersManager() {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        image: null,
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/admin/members');
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            toast.error('Failed to fetch team members');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('order', formData.order.toString());
            formDataToSend.append('isActive', formData.isActive.toString());

            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            }

            const url = editingMember
                ? `/api/admin/members/${editingMember.id}`
                : '/api/admin/members';
            const method = editingMember ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(
                    editingMember
                        ? 'Team member updated successfully'
                        : 'Team member added successfully'
                );
                fetchMembers();
                setIsModalOpen(false);
                resetForm();
            } else {
                toast.error(data.error || 'Failed to save team member');
            }
        } catch (error) {
            console.error('Error saving team member:', error);
            toast.error('An error occurred while saving the team member');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            const response = await fetch(`/api/admin/members/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Team member deleted successfully');
                fetchMembers();
            } else {
                toast.error('Failed to delete team member');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
        }
    };

    const handleOrderChange = async (memberId, direction) => {
        const memberIndex = members.findIndex(m => m.id === memberId);
        if (memberIndex === -1) return;

        const newMembers = [...members];
        const member = newMembers[memberIndex];
        const adjacentMember = newMembers[memberIndex + (direction === 'up' ? -1 : 1)];

        if (!adjacentMember) return;

        // Swap orders
        const tempOrder = member.order;
        member.order = adjacentMember.order;
        adjacentMember.order = tempOrder;

        // Update both members
        try {
            await Promise.all([
                fetch(`/api/admin/members/${member.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        ...member,
                        order: member.order
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`/api/admin/members/${adjacentMember.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        ...adjacentMember,
                        order: adjacentMember.order
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            fetchMembers();
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            title: '',
            description: '',
            image: null,
            order: members.length,
            isActive: true
        });
        setEditingMember(null);
    };

    return (
        <div className="space-y-6">
            {/* Add Button */}
            <button
                onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
                <Plus size={20} />
                <span>Add Team Member</span>
            </button>

            {/* Members Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                        <motion.div
                            key={member.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    {member.profileImage ? (
                                        <img
                                            src={member.profileImage}
                                            alt={member.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                            <ImageIcon size={24} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <p className="text-sm text-gray-500">{member.title}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingMember(member);
                                            setFormData({
                                                name: member.name,
                                                title: member.title,
                                                description: member.description,
                                                image: null,
                                                order: member.order,
                                                isActive: member.isActive
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">{member.description}</p>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${member.isActive
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {member.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <div className="flex gap-1">
                                    {index > 0 && (
                                        <button
                                            onClick={() => handleOrderChange(member.id, 'up')}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <MoveUp size={16} />
                                        </button>
                                    )}
                                    {index < members.length - 1 && (
                                        <button
                                            onClick={() => handleOrderChange(member.id, 'down')}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <MoveDown size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profile Image
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                                                <Upload size={20} />
                                                <span>Choose File</span>
                                                <input
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </label>
                                            {formData.image && (
                                                <span className="text-sm text-gray-500">
                                                    {formData.image.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isActive: e.target.checked,
                                                })
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="isActive"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Check size={20} />
                                                    <span>Save</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
} 