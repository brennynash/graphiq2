'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Globe,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Save,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const settingCategories = [
    {
        id: 'general',
        name: 'General Settings',
        icon: SettingsIcon,
        settings: [
            { key: 'siteName', label: 'Site Name', type: 'text' },
            { key: 'siteDescription', label: 'Site Description', type: 'textarea' },
            { key: 'logo', label: 'Logo URL', type: 'text' },
            { key: 'favicon', label: 'Favicon URL', type: 'text' },
        ]
    },
    {
        id: 'contact',
        name: 'Contact Information',
        icon: Mail,
        settings: [
            { key: 'email', label: 'Email Address', type: 'email' },
            { key: 'phone', label: 'Phone Number', type: 'tel' },
            { key: 'address', label: 'Address', type: 'textarea' },
            { key: 'googleMapsUrl', label: 'Google Maps URL', type: 'url' },
        ]
    },
    {
        id: 'social',
        name: 'Social Media',
        icon: Facebook,
        settings: [
            { key: 'facebook', label: 'Facebook URL', type: 'url' },
            { key: 'twitter', label: 'Twitter URL', type: 'url' },
            { key: 'instagram', label: 'Instagram URL', type: 'url' },
            { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
        ]
    },
    {
        id: 'seo',
        name: 'SEO Settings',
        icon: Globe,
        settings: [
            { key: 'metaTitle', label: 'Default Meta Title', type: 'text' },
            { key: 'metaDescription', label: 'Default Meta Description', type: 'textarea' },
            { key: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text' },
        ]
    }
];

export default function SettingsManager() {
    const [activeCategory, setActiveCategory] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            toast.error('Failed to fetch settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                toast.success('Settings saved successfully');
                setHasChanges(false);
            } else {
                toast.error('Failed to save settings');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    const renderInput = (setting) => {
        const value = settings[setting.key] || '';

        switch (setting.type) {
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                    />
                );
            case 'url':
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            value={value}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://"
                        />
                        {value && (
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Globe size={20} />
                            </a>
                        )}
                    </div>
                );
            default:
                return (
                    <input
                        type={setting.type}
                        value={value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );
        }
    };

    return (
        <div className="flex gap-6">
            {/* Categories Sidebar */}
            <div className="w-64 bg-white p-4 rounded-2xl shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>
                <nav className="space-y-1">
                    {settingCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors
                                    ${activeCategory === category.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{category.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Settings Form */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                {settingCategories.find(c => c.id === activeCategory)?.name}
                            </h2>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2
                                    ${hasChanges
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {settingCategories
                                .find(c => c.id === activeCategory)
                                ?.settings.map((setting) => (
                                    <div key={setting.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {setting.label}
                                        </label>
                                        {renderInput(setting)}
                                    </div>
                                ))}
                        </div>

                        {hasChanges && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                                <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                                <p className="text-sm text-blue-600">
                                    You have unsaved changes. Don't forget to save your changes before leaving this page.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 