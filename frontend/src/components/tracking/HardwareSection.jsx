import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function HardwareSection({ projectId }) {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", status: "Designed", datasheet_url: "" });

    const fetchItems = () => {
        api.get(`/tracking/hardware/${projectId}`).then(res => setItems(res.data.items));
    };

    useEffect(() => {
        fetchItems();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post(`/tracking/hardware/${projectId}`, formData);
        setFormData({ name: "", status: "Designed", datasheet_url: "" });
        setShowForm(false);
        fetchItems();
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this component?")) {
            await api.delete(`/tracking/hardware/${id}`);
            fetchItems();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Hardware Components</h3>
                <button onClick={() => setShowForm(!showForm)} className="btn text-sm py-1 px-3">
                    {showForm ? "Cancel" : "Add Component"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                    <input
                        className="input w-full"
                        placeholder="Component Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <select
                        className="input w-full"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option>Designed</option>
                        <option>Prototyping</option>
                        <option>Testing</option>
                        <option>Verified</option>
                    </select>
                    <input
                        className="input w-full"
                        placeholder="Datasheet URL"
                        value={formData.datasheet_url}
                        onChange={e => setFormData({ ...formData, datasheet_url: e.target.value })}
                    />
                    <button type="submit" className="btn w-full">Add Component</button>
                </form>
            )}

            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-white">
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{item.status}</span>
                                {item.datasheet_url && (
                                    <a href={item.datasheet_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Datasheet</a>
                                )}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">×</button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-500 text-center text-sm">No hardware components tracked.</p>}
            </div>
        </div>
    );
}
