'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ProjectsTable() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        mainImage: '',
        images: [],
        industry: '',
        isFeatured: false,
        order: 0
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/admin/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            // Ensure we always set an array
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to fetch projects');
            setProjects([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingProject
                ? `/api/admin/projects/${editingProject.id}`
                : '/api/admin/projects';

            const method = editingProject ? 'PUT' : 'POST';

            // Convert images string to array if it's a string
            const processedData = {
                ...formData,
                images: typeof formData.images === 'string'
                    ? formData.images.split(',').map(img => img.trim())
                    : formData.images,
                order: parseInt(formData.order) || 0
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData)
            });

            if (!response.ok) {
                throw new Error('Failed to save project');
            }

            toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully');
            await fetchProjects(); // Refetch after successful save
            resetForm();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            toast.success('Project deleted successfully');
            await fetchProjects(); // Refetch after successful delete
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            title: project.title,
            description: project.description,
            mainImage: project.mainImage,
            images: project.images || [],
            industry: project.industry || '',
            isFeatured: project.isFeatured || false,
            order: project.order || 0
        });
    };

    const resetForm = () => {
        setEditingProject(null);
        setFormData({
            name: '',
            title: '',
            description: '',
            mainImage: '',
            images: [],
            industry: '',
            isFeatured: false,
            order: 0
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

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

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Main Image URL</label>
                        <input
                            type="url"
                            value={formData.mainImage}
                            onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Industry</label>
                        <input
                            type="text"
                            value={formData.industry || ''}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Display Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            className="w-full p-2 border rounded"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">Featured Project</span>
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Additional Images URLs (comma-separated)</label>
                        <textarea
                            value={Array.isArray(formData.images) ? formData.images.join(', ') : formData.images}
                            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows="2"
                            placeholder="https://image1.jpg, https://image2.jpg"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {editingProject ? 'Update Project' : 'Add Project'}
                    </button>

                    {editingProject && (
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(projects) && projects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.order}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {project.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.industry || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.isFeatured ? '✓' : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!Array.isArray(projects) || projects.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No projects found</p>
                    </div>
                )}
            </div>
        </div>
    );
} 