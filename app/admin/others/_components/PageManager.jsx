'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function PageManager() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        content: '',
        isActive: true,
        company: '',
        street: '',
        city: '',
        phone: '',
        email: '',
        website: '',
        pressKitTitle: '',
        pressKitDescription: '',
        downloadLink: '',
        downloadText: '',
        contactTitle: '',
        contactName: '',
        contactEmail: '',
        privacyIntro: '',
        lastUpdated: ''
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await fetch('/api/admin/pages');
            if (!response.ok) {
                throw new Error('Failed to fetch pages');
            }
            const data = await response.json();
            setPages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching pages:', error);
            toast.error('Failed to fetch pages');
            setPages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let content = formData.content;

            if (formData.slug === 'imprint') {
                content = JSON.stringify({
                    title: "Angaben gemäß § 5 TMG:",
                    company: formData.company || formData.title,
                    address: {
                        title: "Anschrift:",
                        street: formData.street,
                        city: formData.city
                    },
                    contact: {
                        title: "Kontakt:",
                        phone: formData.phone,
                        email: formData.email,
                        website: formData.website
                    }
                });
            } else if (formData.slug === 'press') {
                content = JSON.stringify({
                    title: formData.title,
                    pressKit: {
                        title: formData.pressKitTitle,
                        description: formData.pressKitDescription,
                        downloadLink: formData.downloadLink,
                        downloadText: formData.downloadText
                    },
                    contact: {
                        title: formData.contactTitle,
                        name: formData.contactName,
                        email: formData.contactEmail
                    }
                });
            } else if (formData.slug === 'privacy') {
                let sections;
                try {
                    sections = JSON.parse(formData.content);
                    if (!Array.isArray(sections)) {
                        sections = [];
                    }
                } catch {
                    sections = [];
                }

                content = JSON.stringify({
                    title: formData.title,
                    intro: formData.privacyIntro,
                    sections: sections,
                    lastUpdated: formData.lastUpdated
                });
            }

            const response = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: formData.slug,
                    title: formData.title,
                    content,
                    isActive: formData.isActive
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save page');
            }

            toast.success('Page saved successfully');
            await fetchPages();
            setFormData({
                slug: '',
                title: '',
                content: '',
                isActive: true,
                company: '',
                street: '',
                city: '',
                phone: '',
                email: '',
                website: '',
                pressKitTitle: '',
                pressKitDescription: '',
                downloadLink: '',
                downloadText: '',
                contactTitle: '',
                contactName: '',
                contactEmail: '',
                privacyIntro: '',
                lastUpdated: ''
            });
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('Failed to save page');
        }
    };

    const handleEdit = (page) => {
        if (page.slug === 'imprint') {
            try {
                const content = JSON.parse(page.content);
                setFormData({
                    slug: page.slug,
                    title: page.title,
                    content: '',
                    isActive: page.isActive,
                    company: content.company,
                    street: content.address.street,
                    city: content.address.city,
                    phone: content.contact.phone,
                    email: content.contact.email,
                    website: content.contact.website
                });
            } catch {
                setFormData({
                    ...page,
                    company: '',
                    street: '',
                    city: '',
                    phone: '',
                    email: '',
                    website: ''
                });
            }
        } else if (page.slug === 'press') {
            try {
                const content = JSON.parse(page.content);
                setFormData({
                    slug: page.slug,
                    title: content.title,
                    content: '',
                    isActive: page.isActive,
                    pressKitTitle: content.pressKit.title,
                    pressKitDescription: content.pressKit.description,
                    downloadLink: content.pressKit.downloadLink,
                    downloadText: content.pressKit.downloadText,
                    contactTitle: content.contact.title,
                    contactName: content.contact.name,
                    contactEmail: content.contact.email
                });
            } catch {
                setFormData({
                    ...page,
                    pressKitTitle: '',
                    pressKitDescription: '',
                    downloadLink: '',
                    downloadText: '',
                    contactTitle: '',
                    contactName: '',
                    contactEmail: ''
                });
            }
        } else if (page.slug === 'privacy') {
            try {
                const content = JSON.parse(page.content);
                setFormData({
                    slug: page.slug,
                    title: content.title,
                    content: JSON.stringify(content.sections, null, 2),
                    isActive: page.isActive,
                    privacyIntro: content.intro,
                    lastUpdated: content.lastUpdated
                });
            } catch {
                setFormData({
                    ...page,
                    privacyIntro: '',
                    lastUpdated: ''
                });
            }
        } else {
            setFormData({
                ...page
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold mb-4">Manage Pages</h2>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Page Type</label>
                        <select
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Page Type</option>
                            <option value="imprint">Imprint</option>
                            <option value="privacy">Privacy Policy</option>
                            <option value="press">Press</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {formData.slug === 'imprint' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Street</label>
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Website</label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </>
                    ) : formData.slug === 'press' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Press Kit Title</label>
                                <input
                                    type="text"
                                    value={formData.pressKitTitle}
                                    onChange={(e) => setFormData({ ...formData, pressKitTitle: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Press Kit Description</label>
                                <textarea
                                    value={formData.pressKitDescription}
                                    onChange={(e) => setFormData({ ...formData, pressKitDescription: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Download Link</label>
                                <input
                                    type="text"
                                    value={formData.downloadLink}
                                    onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Download Text</label>
                                <input
                                    type="text"
                                    value={formData.downloadText}
                                    onChange={(e) => setFormData({ ...formData, downloadText: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Section Title</label>
                                <input
                                    type="text"
                                    value={formData.contactTitle}
                                    onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Name</label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </>
                    ) : formData.slug === 'privacy' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Introduction</label>
                                <textarea
                                    value={formData.privacyIntro}
                                    onChange={(e) => setFormData({ ...formData, privacyIntro: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows="2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Sections (JSON format)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-2 border rounded font-mono text-sm"
                                    rows="20"
                                    required
                                    placeholder="[
  {
    'title': 'Section Title',
    'content': ['Paragraph 1', 'Paragraph 2'],
    'subsections': [
      {
        'subtitle': 'Subsection Title',
        'content': ['Subsection content']
      }
    ],
    'list': ['List item 1', 'List item 2']
  }
]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Updated</label>
                                <input
                                    type="text"
                                    value={formData.lastUpdated}
                                    onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                    placeholder="February 27, 2025"
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows="10"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">Active</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Page
                </button>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                    {page.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {page.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${page.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {page.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleEdit(page)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No pages found</p>
                    </div>
                )}
            </div>
        </div>
    );
} 