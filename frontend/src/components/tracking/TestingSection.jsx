import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function TestingSection({ projectId }) {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", date: "", result: "Pass", report_url: "" });

    const fetchItems = () => {
        api.get(`/tracking/testing/${projectId}`).then(res => setItems(res.data.items));
    };

    useEffect(() => {
        fetchItems();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post(`/tracking/testing/${projectId}`, formData);
        setFormData({ name: "", date: "", result: "Pass", report_url: "" });
        setShowForm(false);
        fetchItems();
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this session?")) {
            await api.delete(`/tracking/testing/${id}`);
            fetchItems();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Test Sessions</h3>
                <button onClick={() => setShowForm(!showForm)} className="btn text-sm py-1 px-3">
                    {showForm ? "Cancel" : "Add Session"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                    <input
                        className="input w-full"
                        placeholder="Session Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        className="input w-full"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                    <select
                        className="input w-full"
                        value={formData.result}
                        onChange={e => setFormData({ ...formData, result: e.target.value })}
                    >
                        <option>Pass</option>
                        <option>Fail</option>
                        <option>Partial</option>
                    </select>
                    <input
                        className="input w-full"
                        placeholder="Report URL"
                        value={formData.report_url}
                        onChange={e => setFormData({ ...formData, report_url: e.target.value })}
                    />
                    <button type="submit" className="btn w-full">Add Session</button>
                </form>
            )}

            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-white">
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="flex gap-2 text-xs text-gray-500 items-center">
                                <span>{item.date}</span>
                                <span className={`px-2 py-0.5 rounded ${item.result === 'Pass' ? 'bg-green-50 text-green-600' :
                                        item.result === 'Fail' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                                    }`}>{item.result}</span>
                                {item.report_url && (
                                    <a href={item.report_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Report</a>
                                )}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">×</button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-500 text-center text-sm">No test sessions recorded.</p>}
            </div>
        </div>
    );
}
