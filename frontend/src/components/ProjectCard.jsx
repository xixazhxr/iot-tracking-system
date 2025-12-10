import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { Building2, Copy, Calendar, Users, MoreVertical, CheckCircle } from "lucide-react";

export default function ProjectCard({ project, onUpdate }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleFinish = async (e) => {
        e.stopPropagation();
        try {
            await api.put(`/projects/${project.id}`, { stage: 'Completed', status: 'Completed' });
            toast.success("Project marked as completed");
            setShowMenu(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to complete project", error);
            toast.error("Failed to complete project");
        }
    };

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
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 bottom-8 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in duration-200 origin-bottom-right">
                                <button
                                    onClick={handleFinish}
                                    className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                >
                                    <CheckCircle size={14} /> Finish
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert("Duplicate functionality coming soon");
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Copy size={14} /> Duplicate
                                </button>
                            </div>
                        )}
                        {showMenu && (
                            <div className="fixed inset-0 z-0 cursor-default" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
