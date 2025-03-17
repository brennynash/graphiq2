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
    Clock,
    Tag,
    Link
} from 'lucide-react';
import { toast } from 'sonner';

export default function BlogsManager() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        topic: '',
        readTime: 5,
        coverImage: null,
        media: [],
        url: '',
        content: ''
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('/api/admin/blogs');
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to fetch blogs');
            }

            setBlogs(responseData.data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Failed to fetch blogs');
        } finally {
            setIsLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = generateSlug(title);
        setFormData({ ...formData, title, slug });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('slug', formData.slug);
            formDataToSend.append('topic', formData.topic);
            formDataToSend.append('readTime', formData.readTime.toString());
            formDataToSend.append('url', formData.url);
            formDataToSend.append('content', formData.content);

            if (formData.coverImage instanceof File) {
                formDataToSend.append('coverImage', formData.coverImage);
            }

            formData.media.forEach((file) => {
                if (file instanceof File) {
                    formDataToSend.append('media', file);
                }
            });

            const url = editingBlog
                ? `/api/admin/blogs/${editingBlog.id}`
                : '/api/admin/blogs';
            const method = editingBlog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to save blog');
            }

            toast.success(responseData.message || (editingBlog ? 'Blog updated successfully' : 'Blog created successfully'));
            await fetchBlogs();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving blog:', error);
            toast.error(error.message || 'Failed to save blog');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`/api/admin/blogs/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Blog deleted successfully');
                fetchBlogs();
            } else {
                toast.error(data.error || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('An error occurred while deleting the blog');
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, coverImage: file });
        }
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, media: [...formData.media, ...files] });
    };

    const removeMedia = (index) => {
        setFormData({
            ...formData,
            media: formData.media.filter((_, i) => i !== index)
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            topic: '',
            readTime: 5,
            coverImage: null,
            media: [],
            url: '',
            content: ''
        });
        setEditingBlog(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Blog Post</span>
                </button>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <motion.div
                        key={blog.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border"
                    >
                        <a
                            href={blog.url || `/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <div className="relative aspect-video mb-4 rounded-xl overflow-hidden">
                                {blog.coverImage ? (
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <ImageIcon size={32} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Tag size={14} />
                                            <span>{blog.topic}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            <span>{blog.readTime} min read</span>
                                        </div>
                                        {blog.url && (
                                            <div className="flex items-center gap-1">
                                                <Link size={14} />
                                                <span>External Link</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setEditingBlog(blog);
                                            setFormData({
                                                title: blog.title,
                                                slug: blog.slug,
                                                topic: blog.topic,
                                                readTime: blog.readTime,
                                                coverImage: null,
                                                media: [],
                                                url: blog.url,
                                                content: blog.content
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(blog.id);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
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
                                            onChange={handleTitleChange}
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL Slug
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, slug: generateSlug(e.target.value) })
                                                }
                                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, slug: generateSlug(formData.title) })}
                                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            This will be the URL of your blog post: /blog/{formData.slug}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Topic
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.topic}
                                            onChange={(e) =>
                                                setFormData({ ...formData, topic: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Read Time (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.readTime}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    readTime: parseInt(e.target.value) || 0
                                                })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cover Image
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                                                <Upload size={20} />
                                                <span>Choose File</span>
                                                <input
                                                    type="file"
                                                    onChange={handleCoverImageChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </label>
                                            {formData.coverImage && (
                                                <span className="text-sm text-gray-500">
                                                    {formData.coverImage.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Media
                                        </label>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                                                    <Upload size={20} />
                                                    <span>Add Files</span>
                                                    <input
                                                        type="file"
                                                        onChange={handleMediaChange}
                                                        accept="image/*,video/*"
                                                        multiple
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            {formData.media.length > 0 && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {formData.media.map((file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                                                        >
                                                            <span className="text-sm text-gray-500 truncate">
                                                                {file.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMedia(index)}
                                                                className="text-red-500 hover:text-red-600"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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
                                            rows={6}
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Write your blog post content here..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            External URL (Optional)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Link size={16} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={formData.url}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, url: e.target.value })
                                                    }
                                                    placeholder="https://example.com/blog-post"
                                                    className="w-full pl-10 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            If provided, clicking the blog post will redirect to this URL instead of the internal blog page
                                        </p>
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