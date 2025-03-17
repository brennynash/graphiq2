import { useState } from 'react';
import { X, Upload, Check, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProjectForm({ project, projectTypes, industries, onClose, onSave }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isNewIndustry, setIsNewIndustry] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: project?.title || '',
        name: project?.name || '',
        description: project?.description || '',
        mainImage: project?.mainImage || '',
        industry: project?.industry || '',
        isFeatured: project?.isFeatured || false,
        order: project?.order || 0,
        images: project?.images || []
    });
    const [newIndustryValue, setNewIndustryValue] = useState('');
    const [previewImage, setPreviewImage] = useState(project?.mainImage || null);

    const handleImageUpload = async (file, isMainImage = false) => {
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();

            if (isMainImage) {
                setFormData(prev => ({ ...prev, mainImage: data.url }));
                setPreviewImage(data.url);
            } else {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, data.url]
                }));
            }

            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleMainImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleImageUpload(file, true);
        }
    };

    const handleAdditionalImagesChange = async (e) => {
        const files = Array.from(e.target.files || []);
        for (const file of files) {
            await handleImageUpload(file, false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('mainImage', formData.mainImage);
            formDataToSend.append('industry', isNewIndustry ? newIndustryValue : formData.industry);
            formDataToSend.append('isFeatured', formData.isFeatured);
            formDataToSend.append('order', formData.order);

            // Append additional images
            formData.images.forEach((imageUrl, index) => {
                formDataToSend.append(`images[${index}]`, imageUrl);
            });

            const response = await fetch('/api/admin/projects', {
                method: project ? 'PUT' : 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save project');
            }

            toast.success(project ? 'Project updated successfully' : 'Project created successfully');
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(error.message || 'Failed to save project');
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
                            {project ? 'Edit Project' : 'Add New Project'}
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
                                Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Leave empty to use title"
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
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Main Image
                            </label>
                            <div className="space-y-4">
                                {previewImage ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                        <Image
                                            src={previewImage}
                                            alt="Main project image"
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
                                            onChange={handleMainImageChange}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry
                            </label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <select
                                        value={isNewIndustry ? "new" : formData.industry}
                                        onChange={(e) => {
                                            if (e.target.value === "new") {
                                                setIsNewIndustry(true);
                                                setFormData({ ...formData, industry: "" });
                                            } else {
                                                setIsNewIndustry(false);
                                                setFormData({ ...formData, industry: e.target.value });
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={!isNewIndustry}
                                    >
                                        <option value="">Select an industry</option>
                                        {industries.map((industry) => (
                                            <option key={industry} value={industry}>
                                                {industry}
                                            </option>
                                        ))}
                                        <option value="new">+ Add new industry</option>
                                    </select>
                                </div>
                                {isNewIndustry && (
                                    <div>
                                        <input
                                            type="text"
                                            value={newIndustryValue}
                                            onChange={(e) => setNewIndustryValue(e.target.value)}
                                            placeholder="Enter new industry"
                                            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Images
                            </label>
                            <div className="space-y-4">
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.images.map((imageUrl, index) => (
                                            <div key={index} className="relative aspect-video rounded-xl overflow-hidden">
                                                <Image
                                                    src={imageUrl}
                                                    alt={`Project image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...formData.images];
                                                        newImages.splice(index, 1);
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors">
                                        <Upload size={20} />
                                        <span>{uploadingImage ? 'Uploading...' : 'Add Images'}</span>
                                        <input
                                            type="file"
                                            onChange={handleAdditionalImagesChange}
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Featured Project</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || uploadingImage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check size={20} />
                                        <span>Save Project</span>
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