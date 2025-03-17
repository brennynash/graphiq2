"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        services: [],
        bgColor: "bg-neutral-white",
        imageUrl: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch("/api/admin/services");
            const data = await response.json();
            setServices(data);
        } catch (error) {
            toast.error("Failed to fetch services");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingService
                ? `/api/admin/services/${editingService.id}`
                : "/api/admin/services";
            const method = editingService ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(
                    editingService ? "Service updated successfully" : "Service created successfully"
                );
                fetchServices();
                setIsModalOpen(false);
                resetForm();
            } else {
                toast.error("Failed to save service");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const response = await fetch(`/api/admin/services/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Service deleted successfully");
                fetchServices();
            } else {
                toast.error("Failed to delete service");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            services: [],
            bgColor: "bg-neutral-white",
            imageUrl: "",
        });
        setEditingService(null);
    };

    const openEditModal = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            services: service.services,
            bgColor: service.bgColor,
            imageUrl: service.imageUrl,
        });
        setIsModalOpen(true);
    };

    const colorOptions = [
        { value: "bg-neutral-white", label: "White" },
        { value: "bg-secondary-purple", label: "Purple" },
        { value: "bg-secondary-yellow", label: "Yellow" },
        { value: "bg-neutral-black", label: "Black" },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Services Management</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Service</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${service.bgColor} p-6 rounded-2xl shadow-sm`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold">{service.title}</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(service)}
                                        className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 hover:bg-black/5 rounded-lg transition-colors text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm mb-4">{service.description}</p>
                            {service.services && service.services.length > 0 && (
                                <div className="space-y-1">
                                    {service.services.map((item, index) => (
                                        <div
                                            key={index}
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <Check size={14} />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {service.imageUrl && (
                                <div className="mt-4 rounded-lg overflow-hidden">
                                    <img
                                        src={service.imageUrl}
                                        alt={service.title}
                                        className="w-full h-40 object-cover"
                                    />
                                </div>
                            )}
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {editingService ? "Edit Service" : "Add New Service"}
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
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Services (one per line)
                                        </label>
                                        <textarea
                                            value={formData.services.join("\n")}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    services: e.target.value
                                                        .split("\n")
                                                        .filter((s) => s.trim()),
                                                })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Background Color
                                        </label>
                                        <select
                                            value={formData.bgColor}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    bgColor: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {colorOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={formData.imageUrl}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        imageUrl: e.target.value,
                                                    })
                                                }
                                                className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter image URL"
                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                                            >
                                                <ImageIcon size={20} />
                                                <span>Upload</span>
                                            </button>
                                        </div>
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