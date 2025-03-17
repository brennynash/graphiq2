"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X, Settings, Link } from "lucide-react";
import { toast } from "sonner";

export default function OthersManager() {
    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);
    const [formData, setFormData] = useState({
        key: "",
        value: "",
        description: "",
        type: "text", // text, textarea, boolean, number, link
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings");
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            toast.error("Failed to fetch settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingSetting
                ? `/api/admin/settings/${editingSetting.id}`
                : "/api/admin/settings";
            const method = editingSetting ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(
                    editingSetting ? "Setting updated successfully" : "Setting created successfully"
                );
                fetchSettings();
                setIsModalOpen(false);
                resetForm();
            } else {
                toast.error("Failed to save setting");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this setting?")) return;

        try {
            const response = await fetch(`/api/admin/settings/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Setting deleted successfully");
                fetchSettings();
            } else {
                toast.error("Failed to delete setting");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({
            key: "",
            value: "",
            description: "",
            type: "text",
        });
        setEditingSetting(null);
    };

    const renderValue = (setting) => {
        switch (setting.type) {
            case "boolean":
                return setting.value === "true" ? "Yes" : "No";
            case "link":
                return (
                    <a
                        href={setting.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Link size={14} />
                        {setting.value}
                    </a>
                );
            default:
                return setting.value;
        }
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
                <span>Add Setting</span>
            </button>

            {/* Settings Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {settings.map((setting) => (
                        <motion.div
                            key={setting.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{setting.key}</h3>
                                    <p className="text-sm text-gray-500">{setting.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingSetting(setting);
                                            setFormData({
                                                key: setting.key,
                                                value: setting.value,
                                                description: setting.description,
                                                type: setting.type,
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(setting.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">{renderValue(setting)}</div>
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
                                        {editingSetting ? "Edit Setting" : "Add New Setting"}
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
                                            Key
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.key}
                                            onChange={(e) =>
                                                setFormData({ ...formData, key: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) =>
                                                setFormData({ ...formData, type: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="text">Text</option>
                                            <option value="textarea">Text Area</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="number">Number</option>
                                            <option value="link">Link</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Value
                                        </label>
                                        {formData.type === "textarea" ? (
                                            <textarea
                                                value={formData.value}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={4}
                                                required
                                            />
                                        ) : formData.type === "boolean" ? (
                                            <select
                                                value={formData.value}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={formData.type === "number" ? "number" : "text"}
                                                value={formData.value}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        )}
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
                                            rows={2}
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