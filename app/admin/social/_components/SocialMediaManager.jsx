'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Share2, Plus, ExternalLink, Check, X } from 'lucide-react';

export default function SocialMediaManager() {
    const [socialMedia, setSocialMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        platform: '',
        url: '',
        isActive: true
    });

    useEffect(() => {
        fetchSocialMedia();
    }, []);

    const fetchSocialMedia = async () => {
        try {
            const response = await fetch('/api/admin/social-media');
            if (!response.ok) {
                throw new Error('Failed to fetch social media');
            }
            const data = await response.json();
            setSocialMedia(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching social media:', error);
            toast.error('Failed to fetch social media');
            setSocialMedia([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/social-media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save social media');
            }

            toast.success('Social media link saved successfully');
            await fetchSocialMedia();
            setFormData({ platform: '', url: '', isActive: true });
        } catch (error) {
            console.error('Error saving social media:', error);
            toast.error('Failed to save social media');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Add New Social Media Link */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <Share2 className="w-5 h-5 text-gray-700" />
                    <h2 className="text-xl font-medium">Add Social Media Link</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Platform</label>
                            <select
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="">Select Platform</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="instagram">Instagram</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">URL</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="https://"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">Active</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Link
                    </button>
                </form>
            </div>

            {/* Social Media Links List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium mb-6">Active Social Media Links</h2>

                <div className="space-y-4">
                    {socialMedia.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No social media links found
                        </div>
                    ) : (
                        socialMedia.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <div>
                                        <h3 className="text-lg font-medium capitalize">{item.platform}</h3>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-gray-500 hover:text-blue-500 flex items-center gap-1"
                                        >
                                            {item.url}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.isActive ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
                                            <Check className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-50 text-gray-700">
                                            <X className="w-3 h-3" /> Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 