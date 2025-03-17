'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import TrendForm from '@/app/components/admin/TrendForm';
import TrendList from '@/app/components/admin/TrendList';

export default function TrendsPage() {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch trends
    const fetchTrends = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/admin/trends');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch trends');
            }

            if (!data.success || !Array.isArray(data.data)) {
                throw new Error('Invalid response format');
            }

            setTrends(data.data);
        } catch (err) {
            console.error('Error fetching trends:', err);
            setError(err.message);
            toast.error('Failed to load trends');
        } finally {
            setLoading(false);
        }
    };

    // Add new trend
    const addTrend = async (trendData) => {
        try {
            const response = await fetch('/api/admin/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trendData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add trend');
            }

            if (!data.success) {
                throw new Error('Invalid response format');
            }

            setTrends(prev => [data.data, ...prev]);
            toast.success('Trend added successfully');
        } catch (err) {
            console.error('Error adding trend:', err);
            toast.error(err.message);
            throw err; // Re-throw to be handled by the form
        }
    };

    // Delete trend
    const deleteTrend = async (id) => {
        try {
            const response = await fetch('/api/admin/trends', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete trend');
            }

            if (!data.success) {
                throw new Error('Invalid response format');
            }

            setTrends(prev => prev.filter(trend => trend.id !== id));
            toast.success('Trend deleted successfully');
        } catch (err) {
            console.error('Error deleting trend:', err);
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchTrends();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Trends</h1>

            <div className="mb-8">
                <TrendForm onSubmit={addTrend} />
            </div>

            {loading ? (
                <div className="text-center py-4">Loading trends...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-4">
                    {error}
                    <button
                        onClick={fetchTrends}
                        className="ml-4 text-blue-500 underline"
                    >
                        Try again
                    </button>
                </div>
            ) : trends.length === 0 ? (
                <div className="text-center py-4">No trends found</div>
            ) : (
                <TrendList trends={trends} onDelete={deleteTrend} />
            )}
        </div>
    );
} 