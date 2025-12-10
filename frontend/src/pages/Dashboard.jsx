import { useEffect, useState } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { LayoutDashboard, CheckSquare, AlertCircle, Users, Zap, TrendingUp, Bell, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stats, setStats] = useState({ projects: 0, tasks: 0, issues: 0, users: 0 });
    const [issuesData, setIssuesData] = useState([]);
    const [velocityData, setVelocityData] = useState([]);
    const [workloadData, setWorkloadData] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [projectHealth, setProjectHealth] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countRes, issuesRes, velocityRes, workloadRes, pendingRes, healthRes, activityRes] = await Promise.all([
                    api.get("/stats/counts"),
                    api.get("/stats/issues-by-severity"),
                    api.get("/stats/task-velocity"),
                    api.get("/stats/team-workload"),
                    api.get("/stats/pending-approvals"),
                    api.get("/stats/project-health"),
                    api.get("/stats/recent-activity")
                ]);

                setStats(countRes.data);
                setIssuesData(issuesRes.data.data);
                setVelocityData(velocityRes.data.data);
                setWorkloadData(workloadRes.data.data);
                setPendingCount(pendingRes.data.count);
                setProjectHealth(healthRes.data.data);
                setRecentActivity(activityRes.data.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#722F37', '#8e3b45', '#a64d5a', '#c06070'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="p-8 bg-gray-50 min-h-screen font-sans">
                {/* Pending Approval Alert */}
                {pendingCount > 0 && (user.role === 'admin' || user.role === 'Admin') && (
                    <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 text-orange-800">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">Action Required: {pendingCount} Pending User Approvals</h3>
                                <p className="text-sm text-orange-700">New members are waiting to join the team.</p>
                            </div>
                        </div>
                        <Link to="/team" className="btn bg-orange-600 hover:bg-orange-700 text-white border-none shadow-orange-200 shadow-lg px-6">
                            Review Requests
                        </Link>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Executive Overview</h1>
                            <p className="text-gray-500 text-lg">Real-time insights for {user.name}</p>
                        </div>

                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-primary/5 rounded-xl text-primary">
                                            <LayoutDashboard size={24} />
                                        </div>
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-gray-900 mb-1">{stats.projects}</h3>
                                    <p className="text-sm text-gray-500 font-medium">Across all teams</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                            <CheckSquare size={24} />
                                        </div>
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-gray-900 mb-1">{stats.tasks}</h3>
                                    <p className="text-sm text-gray-500 font-medium">In progress & done</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                            <AlertCircle size={24} />
                                        </div>
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Open Issues</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-gray-900 mb-1">{stats.issues}</h3>
                                    <p className="text-sm text-gray-500 font-medium">Requires attention</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                            <Users size={24} />
                                        </div>
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Team Size</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-gray-900 mb-1">{stats.users}</h3>
                                    <p className="text-sm text-gray-500 font-medium">Active members</p>
                                </div>
                            </div>
                        </div>

                        {/* Project Health Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Project Health Status</h2>
                                <Link to="/projects" className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1">
                                    View All <ArrowRight size={16} />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projectHealth.slice(0, 3).map((project) => (
                                    <div key={project.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-gray-900">{project.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${project.status === 'Healthy' ? 'bg-green-100 text-green-700' :
                                                    project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {project.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Completion</span>
                                                <span>{project.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'
                                                        }`}
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">{project.total_tasks} total tasks</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Task Velocity</h3>
                                        <p className="text-xs text-gray-500">Tasks completed over time</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <TrendingUp size={20} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={velocityData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                            <Line type="monotone" dataKey="count" stroke="#722F37" strokeWidth={3} dot={{ fill: '#722F37', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Issue Distribution</h3>
                                        <p className="text-xs text-gray-500">Breakdown by severity</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <AlertCircle size={20} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={issuesData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {issuesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Recent Activity */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full max-h-[calc(100vh-4rem)] overflow-y-auto sticky top-4">
                            <div className="p-6 border-b border-gray-50">
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Clock size={20} className="text-primary" />
                                    <h2 className="font-bold text-lg">Recent Activity</h2>
                                </div>
                            </div>
                            <div className="p-4">
                                {recentActivity.length === 0 ? (
                                    <p className="text-center text-gray-400 py-8 text-sm">No recent activity</p>
                                ) : (
                                    <div className="space-y-6 relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                        {recentActivity.map((item) => (
                                            <div key={`${item.type}-${item.id}`} className="relative pl-10">
                                                <div className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.type === 'task' ? 'bg-blue-500' : 'bg-red-500'
                                                    }`}></div>

                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900 line-clamp-2">
                                                        <span className={item.type === 'task' ? 'text-blue-600' : 'text-red-600'}>
                                                            {item.type === 'task' ? 'Created task' : 'Reported issue'}:
                                                        </span>{" "}
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        by <span className="text-gray-600 font-medium">{item.user}</span> • {new Date(item.time).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
                                <Link to="/tasks" className="block text-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                                    View Full History
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
