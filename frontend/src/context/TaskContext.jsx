import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
    const [loading, setLoading] = useState(false);

    const fetchTasks = useCallback(async (projectId = null, params = {}) => {
        setLoading(true);
        try {
            let url = projectId ? `/tasks/project/${projectId}` : "/tasks/";
            const response = await api.get(url, { params });
            setTasks(response.data.tasks);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = async (data) => {
        try {
            await api.post("/tasks/", data);
            toast.success("Task created");
            return true;
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error(error.response?.data?.error || "Failed to create task");
            return false;
        }
    };

    const updateTask = async (id, data) => {
        try {
            await api.put(`/tasks/${id}`, data);
            toast.success("Task updated");
            return true;
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error(error.response?.data?.error || "Failed to update task");
            return false;
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            toast.success("Task deleted");
            // Optimistic update or refetch needed, but component handles it usually via refetch
            return true;
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error(error.response?.data?.error || "Failed to delete task");
            return false;
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, pagination, loading, fetchTasks, createTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
