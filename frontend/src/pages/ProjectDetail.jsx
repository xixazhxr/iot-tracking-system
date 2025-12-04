import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import TaskModal from "../components/TaskModal";
import ProjectModal from "../components/ProjectModal";
import PageTransition from "../components/PageTransition";
import { toast } from "react-hot-toast";
import GanttChart from "../components/GanttChart";
import HardwareSection from "../components/tracking/HardwareSection";
import FirmwareSection from "../components/tracking/FirmwareSection";
import TestingSection from "../components/tracking/TestingSection";
import DeploymentSection from "../components/tracking/DeploymentSection";
import { Calendar, Users, FileText, AlertCircle, Activity, Layers, Trash2, Edit2, Plus, Upload, Download, DollarSign } from "lucide-react";

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCostModal, setShowCostModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Cost State
    const [costData, setCostData] = useState({
        manpower_cost: 0,
        equipment_cost: 0,
        material_cost: 0,
        additional_cost: 0
    });
    const [editingCostType, setEditingCostType] = useState(null);
    const [addingCostValue, setAddingCostValue] = useState("");

    // Team Management State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);

    // Document Management State
    const [docName, setDocName] = useState("");
    const [docUrl, setDocUrl] = useState("");
    const [showUpload, setShowUpload] = useState(false);

    const fetchData = () => {
        api.get(`/projects/${id}`).then(res => {
            console.log("DEBUG: Fetched project data:", res.data);
            setProject(res.data);
            setCostData({
                manpower_cost: res.data.manpower_cost || 0,
                equipment_cost: res.data.equipment_cost || 0,
                material_cost: res.data.material_cost || 0,
                additional_cost: res.data.additional_cost || 0
            });
        });
        api.get(`/tasks/project/${id}`).then(res => setTasks(res.data.tasks));
        api.get(`/progress/project/${id}`).then(res => setProgress(res.data));
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this project?")) {
            await api.delete(`/projects/${id}`);
            toast.success("Project deleted");
            navigate("/projects");
        }
    };

    const handleStageChange = async (newStage) => {
        await api.put(`/projects/${id}`, { ...project, stage: newStage });
        toast.success(`Stage updated to ${newStage}`);
        fetchData();
    };

    const handleCostUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/projects/${id}`, costData);
            toast.success("Project costs updated");
            setShowCostModal(false);
            fetchData();
        } catch (err) {
            toast.error("Failed to update costs");
        }
    };

    const handleSearchUsers = async (q) => {
        setSearchQuery(q);
        if (q.length > 1) {
            const res = await api.get(`/projects/users/search?q=${q}`);
            setSearchResults(res.data.users);
        } else {
            setSearchResults([]);
        }
    };

    const addMember = async (userId) => {
        await api.post(`/projects/${id}/members`, { user_id: userId });
        toast.success("Member added");
        setSearchResults([]);
        setSearchQuery("");
        setShowAddMember(false);
        fetchData();
    };

    const removeMember = async (userId) => {
        if (confirm("Remove this member?")) {
            await api.delete(`/projects/${id}/members/${userId}`);
            toast.success("Member removed");
            fetchData();
        }
    };

    const uploadDocument = async (e) => {
        e.preventDefault();
        await api.post(`/projects/${id}/documents`, { name: docName, url: docUrl });
        toast.success("Document uploaded");
        setDocName("");
        setDocUrl("");
        setShowUpload(false);
        fetchData();
    };

    if (!project) return <div className="p-8 text-center">Loading...</div>;

    const tabs = [
        { id: "overview", label: "Overview", icon: Activity },
        { id: "tasks", label: "Tasks", icon: Layers },
        { id: "timeline", label: "Timeline", icon: Calendar },
        { id: "cost", label: "Project Cost", icon: DollarSign },
        { id: "iot", label: "IoT Progress", icon: Activity },
        { id: "team", label: "Team", icon: Users },
        { id: "docs", label: "Documents", icon: FileText },
        { id: "issues", label: "Issues", icon: AlertCircle },
    ];

    // Calculate timeline progress
    const start = new Date(project.start_date).getTime();
    const end = new Date(project.end_date).getTime();
    const now = new Date().getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    const timelineProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    const totalCost = (costData.manpower_cost || 0) + (costData.equipment_cost || 0) + (costData.material_cost || 0) + (costData.additional_cost || 0);

    return (
        <PageTransition>
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                                <select
                                    value={project.stage}
                                    onChange={(e) => handleStageChange(e.target.value)}
                                    className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-blue-100 transition-colors"
                                >
                                    <option>Planning</option>
                                    <option>Development</option>
                                    <option>Testing</option>
                                    <option>Deployment</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">{project.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowEditModal(true)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Edit2 size={16} /> Edit
                            </button>
                            <button onClick={handleDelete} className="btn bg-white border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 size={16} /> Delete
                            </button>
                            <button onClick={() => setShowTaskModal(true)} className="btn bg-primary hover:bg-primary-dark text-white flex items-center gap-2 shadow-sm">
                                <Plus size={18} /> Add Task
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-gray-100">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                            <p className="font-semibold text-gray-900">{project.customer}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Timeline</p>
                            <p className="font-semibold text-gray-900">{project.start_date} → {project.end_date}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${project.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {project.priority || 'Medium'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Cost</p>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">RM {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto pb-1">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all relative whitespace-nowrap rounded-t-lg ${activeTab === tab.id
                                    ? "text-primary bg-white border-b-2 border-primary"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-lg font-bold mb-6 text-gray-900">Project Timeline</h3>
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                                        <span className="font-medium">{project.start_date}</span>
                                        <span className="font-medium">{project.end_date}</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 rounded-full"
                                            style={{ width: `${timelineProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-3 font-medium">{Math.round(timelineProgress)}% Timeline Elapsed</p>
                                </div>
                                <h3 className="text-lg font-bold mb-4 text-gray-900">Summary</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    This project is currently in the <strong className="text-primary">{project.stage}</strong> phase.
                                    It has <strong>{tasks.length}</strong> tasks and <strong>{project.members?.length || 0}</strong> team members assigned.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-gray-900">Recent Activity</h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500 italic">No recent activity</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "cost" && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-gray-900">Project Cost Breakdown</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[
                                    { key: 'manpower_cost', label: 'Manpower Cost' },
                                    { key: 'equipment_cost', label: 'Equipment Cost' },
                                    { key: 'material_cost', label: 'Material Cost' },
                                    { key: 'additional_cost', label: 'Additional Cost' }
                                ].map((item) => (
                                    <div key={item.key} className="bg-gray-50 p-6 rounded-xl border border-gray-100 relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm text-gray-500">{item.label}</p>
                                            <button
                                                onClick={() => {
                                                    setEditingCostType(item.key);
                                                    setAddingCostValue("");
                                                    setShowCostModal(true);
                                                }}
                                                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-white"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">RM {costData[item.key]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-primary/5 p-8 rounded-xl border border-primary/10 flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-bold text-primary mb-1">Total Project Cost</h4>
                                    <p className="text-gray-600">Sum of all tracked expenses</p>
                                </div>
                                <p className="text-4xl font-bold text-primary">RM {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "tasks" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Tasks ({tasks.length})</h3>
                                <div className="flex gap-3">
                                    <select className="input py-2 text-sm border-gray-200 rounded-lg">
                                        <option>All Status</option>
                                        <option>To Do</option>
                                        <option>In Progress</option>
                                        <option>Overdue</option>
                                    </select>
                                    <button onClick={() => setShowTaskModal(true)} className="btn text-sm py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2">
                                        <Plus size={16} /> New Task
                                    </button>
                                    <button onClick={async () => {
                                        if (confirm("Auto-delete completed and overdue tasks?")) {
                                            const res = await api.post("/tasks/cleanup");
                                            toast.success(res.data.message);
                                            fetchData();
                                        }
                                    }} className="btn bg-red-50 text-red-600 text-sm py-2 px-4 hover:bg-red-100 rounded-lg border border-red-100 flex items-center gap-2">
                                        <Trash2 size={16} /> Cleanup
                                    </button>
                                </div>
                            </div>
                            {tasks.length === 0 && <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">No tasks found.</p>}
                        </div>
                    )}

                    {activeTab === "iot" && (
                        <div>
                            <h3 className="text-lg font-bold mb-8 text-gray-900">IoT Development Progress</h3>
                            {progress ? (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            <div className="flex justify-between mb-4">
                                                <span className="font-bold text-gray-700">Firmware Status</span>
                                                <span className="text-blue-600 font-medium">{progress.firmware_status || 'Pending'}</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            <div className="flex justify-between mb-4">
                                                <span className="font-bold text-gray-700">Hardware Status</span>
                                                <span className="text-purple-600 font-medium">{progress.hardware_status || 'Pending'}</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-1/4 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <HardwareSection projectId={id} />
                                        <FirmwareSection projectId={id} />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <TestingSection projectId={id} />
                                        <DeploymentSection projectId={id} />
                                    </div>
                                </div>
                            ) : <p className="text-gray-500">No progress data initialized.</p>}
                        </div>
                    )}

                    {activeTab === "team" && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-gray-900">Project Team ({project.members?.length || 0})</h3>
                                <button onClick={() => setShowAddMember(!showAddMember)} className="btn text-sm py-2 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                                    {showAddMember ? "Cancel" : <><Plus size={16} /> Add Member</>}
                                </button>
                            </div>

                            {showAddMember && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <input
                                        className="input w-full mb-3 border-gray-300 focus:border-primary focus:ring-primary"
                                        placeholder="Search users by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchUsers(e.target.value)}
                                    />
                                    {searchResults.length > 0 && (
                                        <div className="bg-white border border-gray-200 rounded-lg mt-2 max-h-48 overflow-y-auto shadow-lg">
                                            {searchResults.map(user => (
                                                <div key={user.id} className="p-3 hover:bg-gray-50 flex justify-between items-center cursor-pointer border-b border-gray-50 last:border-none" onClick={() => addMember(user.id)}>
                                                    <span className="font-medium text-gray-700">{user.name} <span className="text-gray-400 font-normal text-sm">({user.email})</span></span>
                                                    <span className="text-primary text-sm font-semibold">Add</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {project.members?.map(member => (
                                    <div key={member.id} className="p-6 border border-gray-100 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                                {member.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{member.role}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeMember(member.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {(!project.members || project.members.length === 0) && (
                                    <p className="text-gray-500 col-span-3 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">No team members assigned yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "docs" && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-gray-900">Documents ({project.attachments?.length || 0})</h3>
                                <button onClick={() => setShowUpload(!showUpload)} className="btn text-sm py-2 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                                    {showUpload ? "Cancel" : <><Upload size={16} /> Upload Document</>}
                                </button>
                            </div>

                            {showUpload && (
                                <form onSubmit={uploadDocument} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                                    <input
                                        className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                                        placeholder="Document Name"
                                        value={docName}
                                        onChange={(e) => setDocName(e.target.value)}
                                        required
                                    />
                                    <input
                                        className="input w-full border-gray-300 focus:border-primary focus:ring-primary"
                                        placeholder="Document URL (e.g., Google Drive link)"
                                        value={docUrl}
                                        onChange={(e) => setDocUrl(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium">Upload</button>
                                </form>
                            )}

                            <div className="space-y-3">
                                {project.attachments?.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <a href={doc.file_url} target="_blank" rel="noreferrer" className="font-bold text-gray-900 hover:text-primary transition-colors">
                                                    {doc.file_name}
                                                </a>
                                                <p className="text-xs text-gray-500 mt-0.5">Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                            <Download size={20} />
                                        </a>
                                    </div>
                                ))}
                                {(!project.attachments || project.attachments.length === 0) && (
                                    <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">No documents uploaded yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "issues" && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Issue Tracking</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Track bugs and issues directly within your project. This feature is currently under development.</p>
                            <button className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium">Report Issue</button>
                        </div>
                    )}

                    {activeTab === "timeline" && (
                        <GanttChart tasks={tasks} />
                    )}

                    {showCostModal && editingCostType && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Update {editingCostType.replace('_cost', '').replace(/^\w/, c => c.toUpperCase())} Cost
                                </h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const currentVal = costData[editingCostType] || 0;
                                    const addVal = parseFloat(addingCostValue) || 0;
                                    const newVal = currentVal + addVal;

                                    const newCostData = { ...costData, [editingCostType]: newVal };

                                    api.put(`/projects/${id}`, newCostData).then(() => {
                                        toast.success("Cost updated successfully");
                                        setCostData(newCostData);
                                        setShowCostModal(false);
                                        fetchData(); // Refresh to be sure
                                    }).catch(() => toast.error("Failed to update cost"));
                                }} className="space-y-4">

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Current Amount</p>
                                        <p className="text-xl font-bold text-gray-900">RM {(costData[editingCostType] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">RM</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input !pl-10 w-full"
                                                placeholder="0.00"
                                                value={addingCostValue}
                                                onChange={(e) => setAddingCostValue(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Enter amount to add to the current cost.</p>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500">New Total</p>
                                            <p className="text-lg font-bold text-primary">
                                                RM {((costData[editingCostType] || 0) + (parseFloat(addingCostValue) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setShowCostModal(false)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                                            <button type="submit" className="btn bg-primary hover:bg-primary-dark text-white">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {showTaskModal && (
                    <TaskModal
                        projectId={id}
                        initialData={editingTask}
                        members={project.members}
                        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
                        onSave={fetchData}
                    />
                )}

                {showEditModal && (
                    <ProjectModal
                        initialData={project}
                        onClose={() => setShowEditModal(false)}
                        onSave={fetchData}
                    />
                )}
            </div>
        </PageTransition>
    );
}
