import { Suspense } from 'react';
import TestimonialsManager from './_components/TestimonialsManager';

export const metadata = {
    title: 'Testimonials | Admin Panel',
    description: 'Manage client testimonials and reviews',
};

export default function TestimonialsPage() {
    return (
        <div className="container mx-auto max-w-7xl">
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            }>
                <TestimonialsManager />
            </Suspense>
        </div>
    );
} 