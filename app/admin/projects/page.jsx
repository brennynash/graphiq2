import { Suspense } from 'react';
import ProjectsManager from './_components/ProjectsManager';

export const metadata = {
    title: 'Projects | Admin Panel',
    description: 'Manage portfolio projects and case studies',
};

export default function ProjectsPage() {
    return (
        <div className="container mx-auto max-w-7xl">
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            }>
                <ProjectsManager />
            </Suspense>
        </div>
    );
} 