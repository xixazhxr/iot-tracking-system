import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function TaskModal({ projectId, onClose, onSave, initialData = null, parentId = null, members = [] }) {
    const [formData, setFormData] = useState({
        project_id: projectId,
        parent_id: parentId,
        name: "",
        description: "",
        assigned_to: "",
        status: "To-Do",
        priority: "Medium",
        deadline: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting task:", formData);

        // Prepare payload
        const payload = {
            ...formData,
            project_id: formData.project_id ? parseInt(formData.project_id) : null,
            parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
            deadline: formData.deadline || null
        };

        try {
            if (initialData) {
                await api.put(`/tasks/${initialData.id}`, payload);
                toast.success("Task updated successfully");
            } else {
                await api.post("/tasks/", payload);
                toast.success("Task created successfully");
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Task save error:", err);
            toast.error(err.response?.data?.error || "Failed to save task");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Task" : parentId ? "Add Sub-task" : "Add New Task"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Task Name</label>
                        <input name="name" required className="input w-full" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" className="input w-full" value={formData.description} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                        {members && members.length > 0 ? (
                            <select name="assigned_to" className="input w-full" value={formData.assigned_to} onChange={handleChange}>
                                <option value="">Select Member</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.name}>{m.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div>
                                <input name="assigned_to" className="input w-full" placeholder="e.g. Alice" value={formData.assigned_to} onChange={handleChange} />
                                <p className="text-xs text-gray-500 mt-1">No team members found in this project. Add members in the "Team" tab to enable selection.</p>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Deadline</label>
                            <input type="date" name="deadline" className="input w-full" value={formData.deadline} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select name="priority" className="input w-full" value={formData.priority} onChange={handleChange}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="btn">{initialData ? "Save Changes" : "Add Task"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
