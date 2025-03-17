'use client';

import { useState, useEffect } from 'react';

export default function ProjectTypeSelector({ selectedType, onSelect }) {
    const [projectTypes, setProjectTypes] = useState([]);

    useEffect(() => {
        const fetchProjectTypes = async () => {
            try {
                const response = await fetch('/api/project-types');
                const data = await response.json();
                setProjectTypes(data);
            } catch (error) {
                console.error('Error fetching project types:', error);
            }
        };

        fetchProjectTypes();
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-standard mb-6">What can we do for you?</h2>
            <div className="flex flex-wrap gap-3">
                {projectTypes.map((type) => (
                    <button
                        key={type.id}
                        type="button"
                        onClick={() => onSelect(type.name)}
                        className={`
                            px-4 py-2 rounded-full border transition-all duration-300
                            ${selectedType === type.name
                                ? 'bg-secondary-purple text-white border-secondary-purple'
                                : 'border-gray-300 hover:border-secondary-purple hover:text-secondary-purple'
                            }
                        `}
                    >
                        {type.name}
                    </button>
                ))}
            </div>
        </div>
    );
} 