import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { XCircle } from "lucide-react";

export default function IssueModal({ issue = null, projectId = null, onClose, onSave }) {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        project_id: projectId || "",
        severity: "Medium",
        status: "Open",
        assigned_to: "",
        description: ""
    });

    useEffect(() => {
        if (issue) {
            setFormData({
                title: issue.title,
                project_id: issue.project_id,
                severity: issue.severity,
                status: issue.status,
                assigned_to: issue.assigned_to || "",
                description: issue.description || ""
            });
        }
        // Only fetch projects if not pre-set or if we need the name for display (though we likely just need ID)
        // Actually, we need to fetch projects list if the user is allowed to change it, or if we just want to show the dropdown.
        // If projectId is passed fixed, we might not need the list, but it's safer to have it for the invalid case.
        fetchProjects();
    }, [issue, projectId]);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects/");
            setProjects(res.data.projects);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.project_id) {
            toast.error("Please select a project");
            return;
        }

        try {
            const payload = {
                ...formData,
                project_id: parseInt(formData.project_id)
            };

            if (issue) {
                await api.put(`/issues/${issue.id}`, payload);
                toast.success("Issue updated successfully");
            } else {
                await api.post("/issues/", payload);
                toast.success("Issue reported successfully");
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Issue save error:", err);
            toast.error(err.response?.data?.error || "Failed to save issue");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{issue ? "Edit Issue" : "Report Issue"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                        <input
                            className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                            placeholder="e.g. Login failed"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                        <select
                            className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                            value={formData.project_id}
                            onChange={e => setFormData({ ...formData, project_id: e.target.value })}
                            required
                            disabled={!!projectId} // Disable if locked to a project
                        >
                            <option value="">Select Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select
                                className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                                value={formData.severity}
                                onChange={e => setFormData({ ...formData, severity: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                            <input
                                className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                                placeholder="Name"
                                value={formData.assigned_to}
                                onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="input w-full min-h-[100px] border-gray-300 focus:border-primary focus:ring-primary"
                            placeholder="Describe the issue in detail..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="btn bg-primary hover:bg-primary-dark text-white">{issue ? "Save Changes" : "Report Issue"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
