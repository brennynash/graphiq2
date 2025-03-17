'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    FileText,
    Image,
    Settings,
    LogOut,
    Menu,
    X,
    Briefcase,
    TrendingUp,
    ListChecks,
    MessageSquare,
    Folder,
    Share2,
    Files,
    ChevronRight,
    Bell,
    Search,
    ChevronLeft,
    Newspaper
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import AdminProfile from './_components/AdminProfile';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    {
        name: 'Content',
        icon: Files,
        children: [
            { name: 'Projects', icon: Briefcase, path: '/admin/projects' },
            { name: 'Project Types', icon: Folder, path: '/admin/project-types' },
            { name: 'Services', icon: ListChecks, path: '/admin/services' },
            { name: 'Blog Posts', icon: FileText, path: '/admin/blogs' },
            { name: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' },
            { name: 'Others', icon: Files, path: '/admin/others' },
        ]
    },
    {
        name: 'Management',
        icon: Users,
        children: [
            { name: 'Team Members', icon: Users, path: '/admin/members' },
            { name: 'Media Library', icon: Image, path: '/admin/media' },
            { name: 'Project Requests', icon: MessageSquare, path: '/admin/requests' },
            { name: 'Trends', icon: TrendingUp, path: '/admin/trends' },
        ]
    },
    {
        name: 'System',
        icon: Settings,
        children: [
            { name: 'Social Media', icon: Share2, path: '/admin/social' },
            { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ]
    }
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNotifications();
        // Set up polling for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/admin/requests?status=pending');
            if (response.ok) {
                const requests = await response.json();
                // Transform requests into notifications format
                const notifs = requests.map(request => ({
                    id: request.id,
                    type: 'project_request',
                    title: 'New project request received',
                    time: new Date(request.createdAt).toLocaleString(),
                    details: {
                        name: request.name,
                        email: request.email,
                        projectType: request.projectType,
                        budget: request.budget,
                        description: request.description
                    }
                }));
                setNotifications(notifs);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/admin/logout', {
                method: 'POST',
            });
            if (response.ok) {
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // If we're on the login page, return just the children without the admin layout
    if (pathname === '/admin/login') {
        return children;
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <Toaster position="top-right" />
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '80px' }}
                className={`fixed top-0 left-0 h-full bg-[#000000] text-white border-r border-[#4A4A4A] z-30 transition-all duration-300 ease-in-out rounded-tr-[32px] rounded-br-[32px]
                    ${isSidebarOpen ? 'w-[280px]' : 'w-20'} hidden lg:block`}
            >
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.h1
                            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                            className="text-xl font-bold text-[#EAFD60] overflow-hidden whitespace-nowrap"
                        >
                            GRAPHIQ.ART
                        </motion.h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-[#4A4A4A] transition-colors text-[#EAFD60]"
                    >
                        <ChevronRight
                            className={`transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}
                            size={20}
                        />
                    </button>
                </div>

                <nav className="mt-4 px-2">
                    {menuItems.map((item, index) => {
                        if (item.children) {
                            return (
                                <div key={index} className="mb-4">
                                    <div className="flex items-center gap-3 p-3 text-[#B3B3B3]">
                                        <item.icon size={20} className="min-w-[20px]" />
                                        <motion.span
                                            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                                            className="font-medium text-sm uppercase overflow-hidden whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    </div>
                                    <div className="ml-3">
                                        {item.children.map((child) => {
                                            const isActive = pathname === child.path;
                                            return (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                    className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all
                                                        ${isActive ? 'bg-[#4A4A4A] text-[#EAFD60]' : 'hover:bg-[#4A4A4A] text-[#FFFFFF]'}`}
                                                >
                                                    <child.icon size={20} className="min-w-[20px]" />
                                                    <motion.span
                                                        animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                                                        className="font-medium overflow-hidden whitespace-nowrap"
                                                    >
                                                        {child.name}
                                                    </motion.span>
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="activeTab"
                                                            className="absolute left-0 w-1 h-8 bg-[#EAFD60] rounded-r-full"
                                                        />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all
                                    ${isActive ? 'bg-[#4A4A4A] text-[#EAFD60]' : 'hover:bg-[#4A4A4A] text-[#FFFFFF]'}`}
                            >
                                <item.icon size={20} className="min-w-[20px]" />
                                <motion.span
                                    animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                                    className="font-medium overflow-hidden whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-8 bg-[#EAFD60] rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Profile */}
                <AdminProfile />

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-2"
                >
                    <LogOut size={20} />
                    <motion.span
                        animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                        className="whitespace-nowrap"
                    >
                        Logout
                    </motion.span>
                </button>
            </motion.aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="fixed top-4 left-4 p-2 bg-[#000000] text-[#EAFD60] rounded-lg shadow-md lg:hidden z-50"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed top-0 left-0 h-full w-[280px] bg-[#000000] text-white z-50 lg:hidden rounded-tr-[32px] rounded-br-[32px]"
                        >
                            <div className="p-4 flex items-center justify-between">
                                <h1 className="text-xl font-bold text-[#EAFD60]">GRAPHIQ.ART</h1>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[#4A4A4A] text-[#EAFD60]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="mt-4 px-2">
                                {menuItems.map((item, index) => {
                                    if (item.children) {
                                        return (
                                            <div key={index} className="mb-4">
                                                <div className="flex items-center gap-3 p-3 text-[#B3B3B3]">
                                                    <item.icon size={20} />
                                                    <span className="font-medium text-sm uppercase">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    {item.children.map((child) => {
                                                        const isActive = pathname === child.path;
                                                        return (
                                                            <Link
                                                                key={child.path}
                                                                href={child.path}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all
                                                                    ${isActive ? 'bg-[#4A4A4A] text-[#EAFD60]' : 'hover:bg-[#4A4A4A] text-[#FFFFFF]'}`}
                                                            >
                                                                <child.icon size={20} />
                                                                <span className="font-medium">{child.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }

                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all
                                                ${isActive ? 'bg-[#4A4A4A] text-[#EAFD60]' : 'hover:bg-[#4A4A4A] text-[#FFFFFF]'}`}
                                        >
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`min-h-screen transition-all duration-300 ease-in-out bg-[#F5F5F5]
                ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'}`}
            >
                {/* Top Bar */}
                <div className="sticky top-0 z-20 bg-[#F5F5F5] border-b border-[#D0D0D0]">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A4A4A]" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D0D0D0] bg-white text-[#000000] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 rounded-lg hover:bg-white transition-colors relative text-[#000000]"
                                >
                                    <Bell size={20} />
                                    {/* Notifications Dropdown */}
                                    {notifications.length > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#000000] rounded-full" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-96 bg-[#F5F5F5] rounded-xl shadow-lg border border-[#D0D0D0] overflow-hidden z-50"
                                        >
                                            <div className="p-4">
                                                <h3 className="text-sm font-semibold mb-2 text-[#000000]">Notifications</h3>
                                                <div className="space-y-3 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#4A4A4A] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                                                    {notifications.length === 0 ? (
                                                        <p className="text-sm text-[#4A4A4A] text-center py-4">No new notifications</p>
                                                    ) : (
                                                        notifications.map(notification => (
                                                            <div
                                                                key={notification.id}
                                                                className="flex items-start gap-3 p-3 hover:bg-white rounded-lg transition-colors"
                                                            >
                                                                <div className="w-2 h-2 mt-2 bg-[#000000] rounded-full" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-[#000000]">{notification.title}</p>
                                                                    <p className="text-xs text-[#4A4A4A] mb-1">{notification.time}</p>
                                                                    {notification.type === 'project_request' && (
                                                                        <div className="mt-2 space-y-2 bg-white p-3 rounded-lg text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-[#4A4A4A]">Client:</span>
                                                                                <span className="font-medium text-[#000000]">{notification.details.name}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-[#4A4A4A]">Project Type:</span>
                                                                                <span className="font-medium text-[#000000]">{notification.details.projectType}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-[#4A4A4A]">Budget:</span>
                                                                                <span className="font-medium text-[#000000]">{notification.details.budget}</span>
                                                                            </div>
                                                                            <div className="mt-2">
                                                                                <span className="text-[#4A4A4A] block mb-1">Description:</span>
                                                                                <p className="text-[#000000]">{notification.details.description}</p>
                                                                            </div>
                                                                            <div className="mt-2 pt-2 border-t border-[#D0D0D0]">
                                                                                <Link
                                                                                    href="/admin/requests"
                                                                                    className="text-[#000000] hover:text-[#4A4A4A] text-sm font-medium"
                                                                                    onClick={() => setShowNotifications(false)}
                                                                                >
                                                                                    View Details →
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white transition-colors text-[#000000]"
                            >
                                <LogOut size={20} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4">
                    {children}
                </div>
            </main>
        </div>
    );
} 