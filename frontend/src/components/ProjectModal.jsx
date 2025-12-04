import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function ProjectModal({ onClose, onSave, initialData = null }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        customer: "",
        start_date: "",
        end_date: "",
        stage: "Planning",
        priority: "Medium"
    });

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                start_date: formatDateForInput(initialData.start_date),
                end_date: formatDateForInput(initialData.end_date)
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting project:", formData);

        // Prepare payload: ensure dates are YYYY-MM-DD
        const payload = {
            ...formData,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null
        };

        try {
            if (initialData) {
                await api.put(`/projects/${initialData.id}`, payload);
                toast.success("Project updated successfully");
            } else {
                await api.post("/projects/", payload);
                toast.success("Project created successfully");
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Project save error:", err);
            toast.error(err.response?.data?.error || "Failed to save project");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Project" : "Create New Project"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input name="name" required className="input w-full" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" className="input w-full" value={formData.description} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer</label>
                        <input name="customer" className="input w-full" value={formData.customer} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" name="start_date" className="input w-full" value={formData.start_date} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" name="end_date" className="input w-full" value={formData.end_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stage</label>
                            <select name="stage" className="input w-full" value={formData.stage} onChange={handleChange}>
                                <option>Planning</option>
                                <option>Development</option>
                                <option>Testing</option>
                                <option>Deployment</option>
                                <option>Completed</option>
                            </select>
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
                        <button type="submit" className="btn">{initialData ? "Save Changes" : "Create Project"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
