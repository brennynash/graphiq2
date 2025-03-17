"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    Copy,
    Check,
    Search,
    Grid,
    List,
} from "lucide-react";
import { toast } from "sonner";

export default function MediaPage() {
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [searchQuery, setSearchQuery] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortBy, setSortBy] = useState("date"); // date or name

    useEffect(() => {
        fetchMedia();
    }, [sortBy]);

    const fetchMedia = async () => {
        try {
            const response = await fetch(`/api/admin/media?sort=${sortBy}`);
            const data = await response.json();
            setMedia(data);
        } catch (error) {
            toast.error("Failed to fetch media");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        await handleUpload(files);
    }, []);

    const handleUpload = async (files) => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("/api/admin/media/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success("Files uploaded successfully");
                fetchMedia();
            } else {
                toast.error("Failed to upload files");
            }
        } catch (error) {
            toast.error("An error occurred during upload");
        }
    };

    const handleDelete = async (ids) => {
        if (!confirm("Are you sure you want to delete the selected items?")) return;

        try {
            const response = await fetch("/api/admin/media/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });

            if (response.ok) {
                toast.success("Items deleted successfully");
                setSelectedItems([]);
                fetchMedia();
            } else {
                toast.error("Failed to delete items");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const copyToClipboard = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success("URL copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy URL");
        }
    };

    const filteredMedia = media.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Media Library</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {viewMode === "grid" ? (
                                <List size={20} />
                            ) : (
                                <Grid size={20} />
                            )}
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    {selectedItems.length > 0 && (
                        <button
                            onClick={() => handleDelete(selectedItems)}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={20} />
                            <span>Delete Selected</span>
                        </button>
                    )}
                </div>

                {/* Upload Area */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-xl p-8 text-center transition-colors
                        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                    `}
                >
                    <div className="flex flex-col items-center gap-4">
                        <Upload size={40} className="text-gray-400" />
                        <div>
                            <p className="text-lg font-medium">
                                Drag and drop files here, or{" "}
                                <label className="text-blue-600 cursor-pointer hover:text-blue-700">
                                    browse
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleUpload(e.target.files)}
                                    />
                                </label>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Supported formats: PNG, JPG, GIF, SVG
                            </p>
                        </div>
                    </div>
                </div>

                {/* Media Grid/List */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                : "space-y-4"
                        }
                    >
                        <AnimatePresence>
                            {filteredMedia.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`
                                        group relative bg-white rounded-xl overflow-hidden border
                                        ${viewMode === "list" ? "flex items-center gap-4" : ""}
                                        ${selectedItems.includes(item.id) ? "ring-2 ring-blue-500" : ""}
                                    `}
                                >
                                    {/* Checkbox */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedItems([...selectedItems, item.id]);
                                                } else {
                                                    setSelectedItems(
                                                        selectedItems.filter((id) => id !== item.id)
                                                    );
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    <div
                                        className={
                                            viewMode === "grid"
                                                ? "aspect-square"
                                                : "w-20 h-20 flex-shrink-0"
                                        }
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info and Actions */}
                                    <div className="p-4">
                                        <h3 className="font-medium truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                onClick={() => copyToClipboard(item.url)}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                title="Copy URL"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete([item.id])}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
} 