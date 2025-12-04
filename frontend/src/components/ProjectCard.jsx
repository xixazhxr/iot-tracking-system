import { useNavigate } from "react-router-dom";
import { Building2, Copy, Calendar, Users } from "lucide-react";

export default function ProjectCard({ project }) {
    const navigate = useNavigate();

    return (
        <div
            className="group bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200"
            onClick={() => navigate(`/projects/${project.id}`)}
        >
            <div className="flex justify-between items-start mb-3">
                <h2 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{project.name}</h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.stage === 'Completed' ? 'bg-green-100 text-green-700' :
                    project.stage === 'Deployment' ? 'bg-purple-100 text-purple-700' :
                        project.stage === 'Testing' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-50 text-blue-700'
                    }`}>
                    {project.stage || 'Planning'}
                </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 size={16} />
                    <span className="truncate max-w-[100px]">{project.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`text-xs font-medium px-2 py-1 rounded ${project.priority === 'High' ? 'bg-red-50 text-red-600' :
                        project.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                        {project.priority || 'Medium'}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert("Duplicate functionality coming soon");
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors"
                        title="Duplicate Project"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
