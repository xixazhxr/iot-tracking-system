import { useState, useEffect } from "react";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";
import { CheckSquare, Clock, AlertCircle, Filter, Search, MoreVertical, Zap, User } from "lucide-react";

export default function Tasks() {
    const [filter, setFilter] = useState("All");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks/");
            setTasks(res.data.tasks);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "All") return true;
        return task.status === filter;
    });

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'text-red-600 bg-red-50 border-red-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'Low': return 'text-green-600 bg-green-50 border-green-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'Done': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <PageTransition>
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
                        <p className="text-gray-500 mt-1">Track and manage tasks across all projects</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                            />
                        </div>
                        <button className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Filter size={18} /> Filter
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {["All", "To-Do", "In Progress", "Testing", "Done", "Overdue"].map((status) => (
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

                {/* Task List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Task Name</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Priority</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Assignee</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${task.status === 'Done' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <CheckSquare size={18} />
                                            </div>
                                            <span className="font-medium text-gray-900">{task.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                                            {task.priority === 'High' && <Zap size={12} />}
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {task.assigned_to ? (
                                                <>
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
                                                        {task.assigned_to[0]}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{task.assigned_to}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic flex items-center gap-1">
                                                    <User size={14} /> Unassigned
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <CheckSquare size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-gray-500">No tasks found</p>
                                            <p className="text-sm">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    );
}
