
import { useTasks } from "../context/TaskContext";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";
import TaskModal from "../components/TaskModal";
import { CheckSquare, Clock, AlertCircle, Filter, Search, MoreVertical, Zap, User, ChevronLeft, ChevronRight, Calendar, ArrowUpDown, Edit2, Trash2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

export default function Tasks() {
    const { tasks, pagination, loading, fetchTasks, deleteTask } = useTasks();
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [view, setView] = useState("list"); // 'list' or 'calendar'
    const [sortBy, setSortBy] = useState("deadline"); // 'deadline' or 'priority'
    const [order, setOrder] = useState("asc");

    // Action Logic
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Poll for updates every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadTasks(pagination.current_page);
        }, 10000);
        return () => clearInterval(interval);
    }, [pagination.current_page, filter, search, sortBy, order]);

    useEffect(() => {
        loadTasks(1);
    }, [filter, sortBy, order]);

    const loadTasks = (page = 1) => {
        const status = filter === "All" ? "" : filter;
        fetchTasks(null, { page, per_page: 20, search, status, sort_by: sortBy, order });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            loadTasks(1);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            loadTasks(newPage);
        }
    };

    const handleTaskUpdate = async (taskId, updates) => {
        try {
            await api.put(`/tasks/${taskId}`, updates);
            toast.success("Task updated");
            loadTasks(pagination.current_page);
        } catch (error) {
            console.error("Failed to update task", error);
            toast.error("Failed to update task");
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
        setActiveMenuId(null);
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'text-red-600 bg-red-50 border-red-100 ring-1 ring-red-200'; // High priority highlight
            case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'Low': return 'text-green-600 bg-green-50 border-green-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'Done': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Overdue': return 'bg-red-100 text-red-700 font-bold'; // Overdue highlight
            case 'To-Do': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    // Simple Calendar Grid Logic
    const renderCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border border-gray-100"></div>);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayTasks = tasks.filter(t => t.deadline === dateStr);
            const isToday = d === today.getDate();

            days.push(
                <div key={d} className={`h-32 border border-gray-100 p-2 overflow-y-auto ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-gray-700'}`}>{d}</span>
                        {dayTasks.length > 0 && <span className="text-xs bg-gray-100 px-1.5 rounded-full text-gray-500">{dayTasks.length}</span>}
                    </div>
                    <div className="space-y-1">
                        {dayTasks.map(t => (
                            <div key={t.id} className={`text-xs p-1.5 rounded border border-l-2 truncate ${t.priority === 'High' ? 'border-l-red-500 bg-red-50 text-red-700' :
                                t.status === 'Done' ? 'border-l-green-500 bg-green-50 text-green-700 opacity-60' :
                                    'border-l-blue-500 bg-blue-50 text-blue-700'
                                }`}>
                                {t.name}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-bold text-gray-500 uppercase">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days}
                </div>
            </div>
        );
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                            />
                        </div>

                        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                            <button
                                onClick={() => setView('list')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <CheckSquare size={16} className="inline mr-2" />List
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Calendar size={16} className="inline mr-2" /> Calendar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
                        >
                            <option value="deadline">Deadline</option>
                            <option value="priority">Priority</option>
                        </select>
                        <button
                            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                        >
                            <ArrowUpDown size={16} />
                        </button>
                    </div>
                </div>

                {view === 'calendar' ? (
                    renderCalendar()
                ) : (
                    /* Task List */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading tasks...</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Task Name</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Priority</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Deadline</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Assignee</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${task.status === 'Done' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        <CheckSquare size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{task.name}</div>
                                                        {task.project_id && <div className="text-xs text-gray-400">Project #{task.project_id}</div>}
                                                    </div>
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
                                                <div className={`flex items-center gap-2 text-sm ${task.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                                    <Clock size={14} />
                                                    {task.deadline ? task.deadline : 'No Deadline'}
                                                </div>
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
                                            <td className="p-4 text-right relative">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === task.id ? null : task.id); }}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {activeMenuId === task.id && (
                                                    <div className="absolute right-0 top-10 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTaskUpdate(task.id, { status: "Done" });
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={14} /> Finish
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Edit2 size={14} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Delete this task?')) {
                                                                    deleteTask(task.id);
                                                                    setActiveMenuId(null);
                                                                    loadTasks(pagination.current_page);
                                                                }
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                                {/* Backdrop to close menu */}
                                                {activeMenuId === task.id && (
                                                    <div className="fixed inset-0 z-0 cursor-default" onClick={() => setActiveMenuId(null)}></div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {tasks.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center">
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
                        )}

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                            <div>
                                Showing page {pagination.current_page} of {pagination.pages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.pages}
                                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showTaskModal && (
                    <TaskModal
                        initialData={editingTask}
                        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
                        onSave={() => loadTasks(pagination.current_page)}
                    />
                )}
            </div>
        </PageTransition >
    );
}
