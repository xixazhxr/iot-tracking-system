import { useEffect, useState } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import PageTransition from "../components/PageTransition";
import { LayoutDashboard, CheckSquare, AlertCircle, Users, Zap, TrendingUp } from "lucide-react";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stats, setStats] = useState({ projects: 0, tasks: 0, issues: 0, users: 0 });
    const [issuesData, setIssuesData] = useState([]);
    const [velocityData, setVelocityData] = useState([]);
    const [workloadData, setWorkloadData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const countRes = await api.get("/stats/counts");
                setStats(countRes.data);

                const issuesRes = await api.get("/stats/issues-by-severity");
                setIssuesData(issuesRes.data.data);

                const velocityRes = await api.get("/stats/task-velocity");
                setVelocityData(velocityRes.data.data);

                const workloadRes = await api.get("/stats/team-workload");
                setWorkloadData(workloadRes.data.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#722F37', '#8e3b45', '#a64d5a', '#c06070'];

    return (
        <PageTransition>
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}</h1>
                    <p className="text-gray-500">Here's what's happening with your projects today.</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Projects</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.projects}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <LayoutDashboard size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Tasks</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.tasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <CheckSquare size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Open Issues</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.issues}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Team Members</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Issues by Severity */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Issues by Severity</h3>
                            <AlertCircle size={20} className="text-gray-400" />
                        </div>
                        <div className="h-72">
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
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Task Velocity */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Task Velocity</h3>
                            <TrendingUp size={20} className="text-gray-400" />
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={velocityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="count" stroke="#722F37" strokeWidth={3} dot={{ fill: '#722F37', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Team Workload */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Team Workload</h3>
                        <Zap size={20} className="text-gray-400" />
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workloadData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="tasks" fill="#722F37" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
