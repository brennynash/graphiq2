'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function TrendsTable() {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTrend, setEditingTrend] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        href: ''
    });

    useEffect(() => {
        fetchTrends();
    }, []);

    const fetchTrends = async () => {
        try {
            const response = await fetch('/api/admin/trends');
            const data = await response.json();
            setTrends(data);
        } catch (error) {
            console.error('Error fetching trends:', error);
            toast.error('Failed to fetch trends');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingTrend
                ? `/api/admin/trends/${editingTrend.id}`
                : '/api/admin/trends';

            const method = editingTrend ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save trend');
            }

            toast.success(editingTrend ? 'Trend updated successfully' : 'Trend created successfully');
            fetchTrends();
            resetForm();
        } catch (error) {
            console.error('Error saving trend:', error);
            toast.error('Failed to save trend');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trend?')) return;

        try {
            const response = await fetch(`/api/admin/trends/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete trend');
            }

            toast.success('Trend deleted successfully');
            fetchTrends();
        } catch (error) {
            console.error('Error deleting trend:', error);
            toast.error('Failed to delete trend');
        }
    };

    const handleEdit = (trend) => {
        setEditingTrend(trend);
        setFormData({
            title: trend.title,
            category: trend.category,
            imageUrl: trend.imageUrl,
            href: trend.href || ''
        });
    };

    const resetForm = () => {
        setEditingTrend(null);
        setFormData({
            title: '',
            category: '',
            imageUrl: '',
            href: ''
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                    {editingTrend ? 'Edit Trend' : 'Add New Trend'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Link URL (href)</label>
                        <input
                            type="url"
                            value={formData.href}
                            onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com/article"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {editingTrend ? 'Update Trend' : 'Add Trend'}
                    </button>

                    {editingTrend && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {trends.map((trend) => (
                            <tr key={trend.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative h-16 w-16">
                                        <Image
                                            src={trend.imageUrl}
                                            alt={trend.title}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{trend.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{trend.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={trend.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {trend.href}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleEdit(trend)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(trend.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 