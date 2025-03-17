'use client';

import { useState } from 'react';
import { X, Upload, Check, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function TrendForm({ trend, onClose, onSave }) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: trend?.title || '',
        description: trend?.description || '',
        image: trend?.image || ''
    });
    const [previewImage, setPreviewImage] = useState(trend?.image || null);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to upload image');
        }

        return data.url;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setPreviewImage(URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = formData.image;
            if (formData.image instanceof File) {
                try {
                    setUploadingImage(true);
                    imageUrl = await uploadImage(formData.image);
                } catch (error) {
                    console.error('Image upload error:', error);
                    toast.error('Failed to upload image. Please try again.');
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            const response = await fetch('/api/admin/trends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    image: imageUrl,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create trend');
            }

            toast.success('Trend created successfully');
            onSave();
            onClose();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to save trend');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {trend ? 'Edit Trend' : 'Add New Trend'}
                        </h2>
                        <button
                            onClick={onClose}
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
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            <div className="space-y-4">
                                {previewImage ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                        <Image
                                            src={previewImage}
                                            alt="Trend image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                                        <ImageIcon className="text-gray-400" size={40} />
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                                        <Upload size={20} />
                                        <span>{uploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                disabled={isLoading || uploadingImage}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || uploadingImage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {isLoading || uploadingImage ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check size={20} />
                                        <span>Save Trend</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 