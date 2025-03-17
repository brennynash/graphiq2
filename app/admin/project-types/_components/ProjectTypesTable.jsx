"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function ProjectTypesTable() {
    const [projectTypes, setProjectTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
    });

    useEffect(() => {
        fetchProjectTypes();
    }, []);

    const fetchProjectTypes = async () => {
        try {
            const response = await fetch("/api/admin/project-types");
            const data = await response.json();
            setProjectTypes(data);
        } catch (error) {
            toast.error("Failed to fetch project types");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingType
                ? `/api/admin/project-types/${editingType.id}`
                : "/api/admin/project-types";
            const method = editingType ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(
                    editingType ? "Project type updated successfully" : "Project type created successfully"
                );
                fetchProjectTypes();
                setIsModalOpen(false);
                resetForm();
            } else {
                toast.error("Failed to save project type");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project type?")) return;

        try {
            const response = await fetch(`/api/admin/project-types/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Project type deleted successfully");
                fetchProjectTypes();
            } else {
                toast.error("Failed to delete project type");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            icon: "",
        });
        setEditingType(null);
    };

    return (
        <div>
            {/* Add Button */}
            <button
                onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                }}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
                <Plus size={20} />
                <span>Add Project Type</span>
            </button>

            {/* Project Types Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectTypes.map((type) => (
                        <motion.div
                            key={type.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {type.icon && (
                                        <span className="text-2xl">{type.icon}</span>
                                    )}
                                    <h2 className="text-xl font-semibold">{type.name}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingType(type);
                                            setFormData({
                                                name: type.name,
                                                description: type.description,
                                                icon: type.icon,
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(type.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600">{type.description}</p>
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
                                        {editingType ? "Edit Project Type" : "Add New Project Type"}
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
                                            Icon (emoji or icon class)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.icon}
                                            onChange={(e) =>
                                                setFormData({ ...formData, icon: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="📱 or fa-mobile"
                                        />
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