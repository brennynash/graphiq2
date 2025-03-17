'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    Clock,
    ArrowRight,
    Calendar,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';

// Placeholder chart component - Replace with your preferred chart library
const LineChart = ({ data }) => (
    <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Chart Placeholder</p>
    </div>
);

export default function TrendsManager() {
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
    const [trends, setTrends] = useState({
        visitors: {
            total: 0,
            change: 0,
            data: []
        },
        projectViews: {
            total: 0,
            change: 0,
            data: []
        },
        requestRate: {
            total: 0,
            change: 0,
            data: []
        },
        popularProjects: []
    });

    useEffect(() => {
        fetchTrends();
    }, [timeRange]);

    const fetchTrends = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/trends?timeRange=${timeRange}`);
            const data = await response.json();
            setTrends(data);
        } catch (error) {
            toast.error('Failed to fetch trends data');
        } finally {
            setIsLoading(false);
        }
    };

    const StatCard = ({ title, value = 0, change = 0, icon: Icon }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-semibold">{(value || 0).toLocaleString()}</h3>
                </div>
                <div className={`p-3 rounded-xl ${(change || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Icon size={20} className={(change || 0) >= 0 ? 'text-green-600' : 'text-red-600'} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                {(change || 0) >= 0 ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />}
                <span className={`text-sm font-medium ${(change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(change || 0)}%
                </span>
                <span className="text-gray-500 text-sm">vs previous period</span>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Trends & Analytics</h1>
                <div className="flex items-center gap-3">
                    <Filter size={20} className="text-gray-500" />
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Visitors"
                            value={trends.visitors.total}
                            change={trends.visitors.change}
                            icon={Users}
                        />
                        <StatCard
                            title="Project Views"
                            value={trends.projectViews.total}
                            change={trends.projectViews.change}
                            icon={Eye}
                        />
                        <StatCard
                            title="Request Rate"
                            value={trends.requestRate.total}
                            change={trends.requestRate.change}
                            icon={Clock}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="text-lg font-semibold mb-4">Visitor Trends</h3>
                            <LineChart data={trends.visitors.data} />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="text-lg font-semibold mb-4">Project Views</h3>
                            <LineChart data={trends.projectViews.data} />
                        </div>
                    </div>

                    {/* Popular Projects */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Popular Projects</h3>
                            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                                View All
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {trends.popularProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-semibold text-gray-500">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-medium">{project.title}</h4>
                                            <p className="text-sm text-gray-500">
                                                {project.views.toLocaleString()} views
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            {new Date(project.lastViewed).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 