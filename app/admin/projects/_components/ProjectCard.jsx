import { Edit2, Trash2, ImageIcon, Star } from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="relative aspect-video">
                {project.mainImage ? (
                    <img
                        src={project.mainImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={40} />
                    </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                        title="Edit project"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors text-red-500"
                        title="Delete project"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                {project.isFeatured && (
                    <div className="absolute top-2 left-2">
                        <div className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star size={12} />
                            <span>Featured</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg">{project.industry}</span>
                </div>
            </div>
        </div>
    );
} 