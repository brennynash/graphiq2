'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import BlogForm from './_components/BlogForm';
import Image from 'next/image';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('/api/admin/blogs');
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const { data } = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Failed to fetch blogs');
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) {
            return;
        }

        try {
            const response = await fetch('/api/admin/blogs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog post');
            }

            toast.success('Blog post deleted successfully');
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog post:', error);
            toast.error('Failed to delete blog post');
        }
    };

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedBlog(null);
    };

    const handleFormSave = () => {
        fetchBlogs();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Blog Posts</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Add Blog Post</span>
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border"
                    >
                        <div className="relative aspect-video">
                            {blog.image ? (
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">No image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {blog.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <a
                                    href={blog.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View Post
                                </a>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <BlogForm
                    blog={selectedBlog}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}
        </div>
    );
} 