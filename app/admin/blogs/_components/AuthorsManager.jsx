'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthorsManager({ onAuthorAdded }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await fetch('/api/admin/authors');
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            toast.error('Failed to fetch authors');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('image', formData.image);

            const response = await fetch('/api/admin/authors', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Author added successfully');
                setIsModalOpen(false);
                setFormData({ name: '', image: '' });
                fetchAuthors();
                if (onAuthorAdded) {
                    onAuthorAdded(data);
                }
            } else {
                toast.error(data.error || 'Failed to add author');
            }
        } catch (error) {
            console.error('Error adding author:', error);
            toast.error('An error occurred while adding the author');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Author</span>
                </button>
            </div>

            {/* Authors List */}
            <div className="space-y-4">
                {authors.map((author) => (
                    <div
                        key={author.id}
                        className="flex items-center justify-between bg-white p-4 rounded-xl border"
                    >
                        <div className="flex items-center gap-3">
                            {author.image ? (
                                <img
                                    src={author.image}
                                    alt={author.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-lg font-medium text-gray-500">
                                        {author.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-medium">{author.name}</h3>
                                {author.image && (
                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                        {author.image}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Author Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Add New Author</h2>
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
                                        Profile Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) =>
                                            setFormData({ ...formData, image: e.target.value })
                                        }
                                        placeholder="https://example.com/profile.jpg"
                                        className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Add Author
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 