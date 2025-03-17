'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/admin/projects');
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to fetch projects');
            }

            setProjects(responseData.data || []);
            setProjectTypes(responseData.projectTypes || []);
            setIndustries(responseData.industries || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Project deleted successfully');
                fetchProjects();
            } else {
                toast.error(data.error || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('An error occurred while deleting the project');
        }
    };

    const handleProjectSaved = () => {
        fetchProjects();
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'featured' && project.isFeatured) ||
            (filter === project.industry);
        return matchesSearch && matchesFilter;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Project</span>
                </button>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Projects</option>
                        <option value="featured">Featured</option>
                        {industries.map((industry) => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={() => {
                            setEditingProject(project);
                            setIsModalOpen(true);
                        }}
                        onDelete={() => handleDelete(project.id)}
                    />
                ))}
            </div>

            {/* Project Form Modal */}
            {isModalOpen && (
                <ProjectForm
                    project={editingProject}
                    projectTypes={projectTypes}
                    industries={industries}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingProject(null);
                    }}
                    onSave={handleProjectSaved}
                />
            )}
        </div>
    );
} 