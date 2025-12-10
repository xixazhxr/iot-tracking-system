import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import PageTransition from "../components/PageTransition";
import IssueModal from "../components/IssueModal";
import { AlertCircle, Filter, Search, Plus, Bug, CheckCircle, XCircle, Clock, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function Issues() {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [editingIssue, setEditingIssue] = useState(null);
    // formData state removed as it's handled in IssueModal

    useEffect(() => {
        fetchIssues();
    }, [filter]);

    const fetchIssues = async () => {
        try {
            const res = await api.get(`/issues/?status=${filter}`);
            setIssues(res.data.issues);
        } catch (err) {
            console.error("Failed to fetch issues", err);
        }
    };

    // fetchProjects is handled inside IssueModal now, but we might want to keep it if we used it elsewhere?
    // Actually IssueModal fetches its own projects. Issues.jsx doesn't use 'projects' state for anything else.
    // So we can remove fetchProjects and projects state if unused.
    // Wait, I left 'projects' in the useState above? 
    // Let's remove fetchProjects and 'projects' state usage.

    // handleSubmit removed

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/issues/${id}`, { status });
            toast.success(`Issue marked as ${status}`);
            fetchIssues();
        } catch (err) {
            console.error("Failed to update status", err);
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this issue?")) return;
        try {
            await api.delete(`/issues/${id}`);
            toast.success("Issue deleted");
            fetchIssues();
        } catch (err) {
            console.error("Failed to delete issue", err);
            toast.error("Failed to delete issue");
        }
    };

    const openEditModal = (issue) => {
        setEditingIssue(issue);
        setShowModal(true);
        setActiveMenuId(null);
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
                            onClick={() => {
                                setEditingIssue(null);
                                setShowModal(true);
                            }}
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

                            <div className="relative ml-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === issue.id ? null : issue.id); }}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {activeMenuId === issue.id && (
                                    <div className="absolute right-0 top-10 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusUpdate(issue.id, 'Closed');
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                        >
                                            <CheckCircle size={14} /> Finish
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditModal(issue); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(issue.id);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                                {activeMenuId === issue.id && (
                                    <div className="fixed inset-0 z-0 cursor-default" onClick={() => setActiveMenuId(null)}></div>
                                )}
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
                    <IssueModal
                        issue={editingIssue}
                        onClose={() => { setShowModal(false); setEditingIssue(null); }}
                        onSave={fetchIssues}
                    />
                )}
            </div>
        </PageTransition >
    );
}
