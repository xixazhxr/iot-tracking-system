import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function DeploymentSection({ projectId }) {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ serial_number: "", status: "Active", location: "" });

    const fetchItems = () => {
        api.get(`/tracking/deployment/${projectId}`).then(res => setItems(res.data.items));
    };

    useEffect(() => {
        fetchItems();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post(`/tracking/deployment/${projectId}`, formData);
        setFormData({ serial_number: "", status: "Active", location: "" });
        setShowForm(false);
        fetchItems();
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this device?")) {
            await api.delete(`/tracking/deployment/${id}`);
            fetchItems();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Deployed Devices</h3>
                <button onClick={() => setShowForm(!showForm)} className="btn text-sm py-1 px-3">
                    {showForm ? "Cancel" : "Add Device"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                    <input
                        className="input w-full"
                        placeholder="Serial Number"
                        value={formData.serial_number}
                        onChange={e => setFormData({ ...formData, serial_number: e.target.value })}
                        required
                    />
                    <select
                        className="input w-full"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option>Active</option>
                        <option>Offline</option>
                        <option>Maintenance</option>
                        <option>Decommissioned</option>
                    </select>
                    <input
                        className="input w-full"
                        placeholder="Location (GPS or Address)"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                    <button type="submit" className="btn w-full">Add Device</button>
                </form>
            )}

            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-white">
                        <div>
                            <p className="font-medium">{item.serial_number}</p>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span className={`px-2 py-0.5 rounded ${item.status === 'Active' ? 'bg-green-50 text-green-600' :
                                        item.status === 'Offline' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                                    }`}>{item.status}</span>
                                <span>{item.location}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">×</button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-500 text-center text-sm">No devices deployed.</p>}
            </div>
        </div>
    );
}
