'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function TrendForm({ onSubmit }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Store the file in formData
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }

            let imageUrl = null;
            if (formData.image) {
                // Create FormData for image upload
                const imageFormData = new FormData();
                imageFormData.append('file', formData.image);
                imageFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

                // Upload to Cloudinary
                const uploadResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: imageFormData
                    }
                );

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.secure_url;
            }

            // Submit trend data
            await onSubmit({
                title: formData.title,
                description: formData.description,
                image: imageUrl
            });

            // Reset form
            setFormData({
                title: '',
                description: '',
                image: null
            });

            // Clear file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter trend title"
                    disabled={isSubmitting}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter trend description"
                    disabled={isSubmitting}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                    Image
                </label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isSubmitting ? 'Adding...' : 'Add Trend'}
            </button>
        </form>
    );
} 