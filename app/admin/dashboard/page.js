'use client';

import {
    Users,
    FileText,
    Image,
    Activity
} from 'lucide-react';

const stats = [
    { name: 'Total Members', value: '0', icon: Users, color: 'bg-blue-500' },
    { name: 'Blog Posts', value: '0', icon: FileText, color: 'bg-green-500' },
    { name: 'Media Files', value: '0', icon: Image, color: 'bg-purple-500' },
    { name: 'Recent Activity', value: '0', icon: Activity, color: 'bg-yellow-500' },
];

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
                    >
                        <dt>
                            <div className={`absolute rounded-md ${item.color} p-3`}>
                                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                {item.name}
                            </p>
                        </dt>
                        <dd className="ml-16 flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                        </dd>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-500 text-sm">No recent activity</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Add New Member
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Create Blog Post
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Upload Media
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 