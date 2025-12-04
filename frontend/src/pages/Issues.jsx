import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import PageTransition from "../components/PageTransition";
import { AlertCircle, Filter, Search, Plus, Bug, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        project_id: "",
        severity: "Medium",
        status: "Open",
        assigned_to: "",
        description: ""
    });

    useEffect(() => {
        fetchIssues();
        fetchProjects();
    }, [filter]);

    const fetchIssues = async () => {
        try {
            const res = await api.get(`/issues/?status=${filter}`);
            setIssues(res.data.issues);
        } catch (err) {
            console.error("Failed to fetch issues", err);
        }
    };

    const fetchProjects = async () => {
        const res = await api.get("/projects/");
        setProjects(res.data.projects);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.project_id) {
            toast.error("Please select a project");
            return;
        }

        try {
            await api.post("/issues/", {
                ...formData,
                project_id: parseInt(formData.project_id)
            });
            toast.success("Issue reported successfully");
            setShowModal(false);
            setFormData({ title: "", project_id: "", severity: "Medium", status: "Open", assigned_to: "", description: "" });
            fetchIssues();
        } catch (err) {
            console.error("Issue report error:", err);
            toast.error(err.response?.data?.error || "Failed to report issue");
        }
    };

    const getSeverityColor = (s) => {
        switch (s) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <PageTransition>
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Issue Tracking</h1>
                        <p className="text-gray-500 mt-1">Manage bugs and technical issues</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                        >
                            <Plus size={18} /> Report Issue
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {["All", "Open", "In Progress", "Closed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${filter === status
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Issue List */}
                <div className="grid gap-4">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${issue.severity === "Critical" ? "bg-red-50 text-red-500" :
                                    issue.severity === "High" ? "bg-orange-50 text-orange-500" :
                                        "bg-blue-50 text-blue-500"
                                    }`}>
                                    <Bug size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{issue.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">Project #{issue.project_id}</span>
                                        <span>•</span>
                                        <span>Assigned to {issue.assigned_to || "Unassigned"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                </span>
                                <span className={`px-3 py-1 rounded-md text-xs font-medium border ${issue.status === "Open" ? "bg-green-50 text-green-700 border-green-100" :
                                    issue.status === "Closed" ? "bg-gray-100 text-gray-600 border-gray-200" :
                                        "bg-yellow-50 text-yellow-700 border-yellow-100"
                                    }`}>
                                    {issue.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {issues.length === 0 && (
                        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Bug size={48} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-500">No issues found</p>
                                <p className="text-sm">Great job! Your projects are running smoothly.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Report Issue</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                                    <input
                                        className="input w-full"
                                        placeholder="e.g. Login failed"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                    <select
                                        className="input w-full"
                                        value={formData.project_id}
                                        onChange={e => setFormData({ ...formData, project_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                                        <select
                                            className="input w-full"
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
                                            className="input w-full"
                                            placeholder="Name"
                                            value={formData.assigned_to}
                                            onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="input w-full min-h-[100px]"
                                        placeholder="Describe the issue in detail..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="btn bg-primary hover:bg-primary-dark text-white">Report Issue</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
