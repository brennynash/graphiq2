'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Briefcase,
    Share2,
    TrendingUp,
    Eye,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Clock,
    DollarSign
} from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        projects: { total: 0, trend: 0 },
        members: { total: 0, trend: 0 },
        blogs: { total: 0, trend: 0 },
        requests: { total: 0, trend: 0, pending: 0 },
        analytics: { visitors: 0, trend: 0 }
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch current stats
                const [projects, members, blogs, requests, analytics] = await Promise.all([
                    fetch('/api/projects').then(res => res.json()),
                    fetch('/api/members').then(res => res.json()),
                    fetch('/api/blogs').then(res => res.json()),
                    fetch('/api/admin/requests').then(res => res.json()),
                    fetch('/api/admin/analytics').then(res => res.json()).catch(() => ({ visitors: 0, trend: 0 }))
                ]);

                // Calculate trends (comparing with last month's data)
                const projectTrend = ((projects.projects?.length - (projects.lastMonth?.length || 0)) / (projects.lastMonth?.length || 1)) * 100;
                const memberTrend = ((members?.length - (members.lastMonth?.length || 0)) / (members.lastMonth?.length || 1)) * 100;
                const blogTrend = ((blogs?.length - (blogs.lastMonth?.length || 0)) / (blogs.lastMonth?.length || 1)) * 100;
                const requestTrend = ((requests?.length - (requests.lastMonth?.length || 0)) / (requests.lastMonth?.length || 1)) * 100;

                setStats({
                    projects: {
                        total: projects.projects?.length || 0,
                        trend: projectTrend
                    },
                    members: {
                        total: members?.length || 0,
                        trend: memberTrend
                    },
                    blogs: {
                        total: blogs?.length || 0,
                        trend: blogTrend
                    },
                    requests: {
                        total: requests?.length || 0,
                        pending: requests?.filter(r => r.status === 'pending').length || 0,
                        trend: requestTrend
                    },
                    analytics: {
                        visitors: analytics?.visitors || 0,
                        trend: analytics?.trend || 0
                    }
                });

                // Fetch recent activities
                const activities = await fetch('/api/admin/activities')
                    .then(res => res.json())
                    .catch(() => []);

                setRecentActivity(activities.map(activity => ({
                    type: activity.type,
                    title: activity.title,
                    time: new Date(activity.timestamp).toLocaleString(),
                    icon: getActivityIcon(activity.type)
                })));

            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh data every 5 minutes
        const interval = setInterval(fetchStats, 300000);
        return () => clearInterval(interval);
    }, []);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'project': return Briefcase;
            case 'blog': return FileText;
            case 'member': return Users;
            case 'request': return MessageSquare;
            case 'visitor': return Eye;
            default: return BarChart3;
        }
    };

    const quickStats = [
        {
            label: 'Total Projects',
            value: stats.projects.total,
            icon: Briefcase,
            trend: stats.projects.trend,
            color: 'blue'
        },
        {
            label: 'Team Members',
            value: stats.members.total,
            icon: Users,
            trend: stats.members.trend,
            color: 'purple'
        },
        {
            label: 'Project Requests',
            value: stats.requests.total,
            secondaryValue: `${stats.requests.pending} pending`,
            icon: MessageSquare,
            trend: stats.requests.trend,
            color: 'yellow'
        },
        {
            label: 'Visitors',
            value: stats.analytics.visitors,
            icon: Eye,
            trend: stats.analytics.trend,
            color: 'green'
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {Math.abs(stat.trend).toFixed(1)}%
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                            <p className="text-2xl font-semibold">{stat.value}</p>
                            {stat.secondaryValue && (
                                <p className="text-sm text-gray-500">{stat.secondaryValue}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium">Recent Activity</h2>
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all">
                                <div className="p-2 rounded-lg bg-gray-100">
                                    <activity.icon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">{activity.title}</h3>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium">Quick Actions</h2>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/admin/projects" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all group">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">New Project</span>
                        </a>
                        <a href="/admin/blogs" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50 transition-all group">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200">
                                <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">New Blog Post</span>
                        </a>
                        <a href="/admin/requests" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-yellow-100 hover:bg-yellow-50 transition-all group">
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">View Requests</span>
                        </a>
                        <a href="/admin/analytics" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50 transition-all group">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200">
                                <Eye className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Analytics</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 