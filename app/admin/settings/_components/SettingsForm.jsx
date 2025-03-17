'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SettingsForm() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        key: 'RESEND_API_KEY',
        value: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save setting');
            }

            toast.success('Setting saved successfully');
            fetchSettings();
            setFormData({ ...formData, value: '' });
        } catch (error) {
            console.error('Error saving setting:', error);
            toast.error('Failed to save setting');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold mb-4">API Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">API Key Name</label>
                        <select
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="RESEND_API_KEY">Resend API Key</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">API Key Value</label>
                        <input
                            type="text"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Enter API key value"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Setting
                </button>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {settings.map((setting) => (
                            <tr key={setting.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{setting.key}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{setting.value}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(setting.updatedAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 