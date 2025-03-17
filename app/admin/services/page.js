'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ServicesManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        bgColor: 'bg-secondary-grey-ish',
        services: ['']  // Initialize with one empty service
    });

    const bgColorOptions = [
        { value: 'bg-secondary-grey-ish', label: 'Grey' },
        { value: 'bg-neutral-black', label: 'Black' },
        { value: 'bg-secondary-blue-ish', label: 'Blue' }
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/admin/services');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to fetch services');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleServiceInputChange = (index, value) => {
        const newServices = [...formData.services];
        newServices[index] = value;
        setFormData((prev) => ({ ...prev, services: newServices }));
    };

    const addServiceField = () => {
        setFormData((prev) => ({
            ...prev,
            services: [...prev.services, '']
        }));
    };

    const removeServiceField = (index) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const filteredServices = formData.services.filter(service => service.trim() !== '');
            const serviceData = {
                ...formData,
                services: filteredServices
            };

            const url = editingService
                ? `/api/admin/services/${editingService.id}`
                : '/api/admin/services';

            const response = await fetch(url, {
                method: editingService ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });

            if (!response.ok) throw new Error('Failed to save service');

            toast.success(editingService ? 'Service updated successfully' : 'Service created successfully');
            fetchServices();
            resetForm();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            imageUrl: service.imageUrl,
            bgColor: service.bgColor,
            services: service.services.length > 0 ? service.services : ['']
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`/api/admin/services/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete service');

            toast.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        }
    };

    const resetForm = () => {
        setEditingService(null);
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            bgColor: 'bg-secondary-grey-ish',
            services: ['']
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {editingService ? 'Edit Service' : 'Add New Service'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows="4"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Image URL</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Background Color</label>
                    <select
                        name="bgColor"
                        value={formData.bgColor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        {bgColorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Services List</label>
                    {formData.services.map((service, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => handleServiceInputChange(index, e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="Enter a service"
                            />
                            <button
                                type="button"
                                onClick={() => removeServiceField(index)}
                                className="px-3 py-1 bg-red-500 text-white rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addServiceField}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Add Service
                    </button>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    >
                        {loading ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
                    </button>
                    {editingService && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Existing Services</h2>
                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="p-4 border rounded flex justify-between items-start"
                        >
                            <div>
                                <h3 className="font-bold">{service.title}</h3>
                                <p className="text-sm text-gray-600">{service.description}</p>
                                {service.services && service.services.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-semibold">Services:</p>
                                        <ul className="list-disc list-inside">
                                            {service.services.map((item, index) => (
                                                <li key={index} className="text-sm">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 