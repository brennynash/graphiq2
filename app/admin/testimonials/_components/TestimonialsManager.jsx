'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Star,
    Check,
    X,
    Image as ImageIcon,
    Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        image: null,
        isActive: true
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/admin/testimonials');
            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            toast.error('Failed to fetch testimonials');
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
            formDataToSend.append('role', formData.role);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('isActive', formData.isActive.toString());

            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            }

            const url = editingTestimonial
                ? `/api/admin/testimonials/${editingTestimonial.id}`
                : '/api/admin/testimonials';
            const method = editingTestimonial ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(
                    editingTestimonial
                        ? 'Testimonial updated successfully'
                        : 'Testimonial created successfully'
                );
                fetchTestimonials();
                setIsModalOpen(false);
                resetForm();
            } else {
                toast.error(data.error || 'Failed to save testimonial');
            }
        } catch (error) {
            console.error('Error saving testimonial:', error);
            toast.error('An error occurred while saving the testimonial');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const response = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Testimonial deleted successfully');
                fetchTestimonials();
            } else {
                toast.error('Failed to delete testimonial');
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

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            company: '',
            content: '',
            rating: 5,
            image: null,
            isActive: true
        });
        setEditingTestimonial(null);
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
                <span>Add Testimonial</span>
            </button>

            {/* Testimonials Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    {testimonial.image ? (
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <ImageIcon size={20} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {testimonial.role} at {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingTestimonial(testimonial);
                                            setFormData({
                                                name: testimonial.name,
                                                role: testimonial.role,
                                                company: testimonial.company,
                                                content: testimonial.content,
                                                rating: testimonial.rating,
                                                image: null,
                                                isActive: testimonial.isActive
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">{testimonial.content}</p>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${testimonial.isActive
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {testimonial.isActive ? 'Active' : 'Inactive'}
                                </span>
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
                                        {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, role: e.target.value })
                                                }
                                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, company: e.target.value })
                                                }
                                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Content
                                        </label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) =>
                                                setFormData({ ...formData, content: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-2">
                                            {[...Array(5)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData({ ...formData, rating: i + 1 })
                                                    }
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        size={24}
                                                        className={
                                                            i < formData.rating
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                        }
                                                    />
                                                </button>
                                            ))}
                                        </div>
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