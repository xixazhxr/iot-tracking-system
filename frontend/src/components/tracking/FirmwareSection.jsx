import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function FirmwareSection({ projectId }) {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ version: "", changelog: "", build_url: "" });

    const fetchItems = () => {
        api.get(`/tracking/firmware/${projectId}`).then(res => setItems(res.data.items));
    };

    useEffect(() => {
        fetchItems();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post(`/tracking/firmware/${projectId}`, formData);
        setFormData({ version: "", changelog: "", build_url: "" });
        setShowForm(false);
        fetchItems();
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this version?")) {
            await api.delete(`/tracking/firmware/${id}`);
            fetchItems();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Firmware Versions</h3>
                <button onClick={() => setShowForm(!showForm)} className="btn text-sm py-1 px-3">
                    {showForm ? "Cancel" : "Add Version"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                    <input
                        className="input w-full"
                        placeholder="Version (e.g. v1.0.0)"
                        value={formData.version}
                        onChange={e => setFormData({ ...formData, version: e.target.value })}
                        required
                    />
                    <textarea
                        className="input w-full"
                        placeholder="Changelog"
                        value={formData.changelog}
                        onChange={e => setFormData({ ...formData, changelog: e.target.value })}
                    />
                    <input
                        className="input w-full"
                        placeholder="Build URL (HEX/BIN)"
                        value={formData.build_url}
                        onChange={e => setFormData({ ...formData, build_url: e.target.value })}
                    />
                    <button type="submit" className="btn w-full">Add Version</button>
                </form>
            )}

            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="p-3 border border-gray-100 rounded-lg bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-800">{item.version}</p>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.changelog}</p>
                                {item.build_url && (
                                    <a href={item.build_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">Download Build</a>
                                )}
                                <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">×</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-500 text-center text-sm">No firmware versions tracked.</p>}
            </div>
        </div>
    );
}
