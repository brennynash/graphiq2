'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';

export default function TrendList({ trends, onDelete }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trends.map((trend) => (
                <div key={trend.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {trend.image && (
                        <div className="relative h-48 w-full">
                            <Image
                                src={trend.image}
                                alt={trend.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{trend.title}</h3>
                        {trend.description && (
                            <p className="text-gray-600 mb-4">{trend.description}</p>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => onDelete(trend.id)}
                                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete trend"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 