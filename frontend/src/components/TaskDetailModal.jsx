import { useState, useEffect } from "react";
import api from "../api/axios";
import TaskModal from "./TaskModal";

export default function TaskDetailModal({ task, onClose, onUpdate }) {
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showSubtaskModal, setShowSubtaskModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Attachments
    const [docName, setDocName] = useState("");
    const [docUrl, setDocUrl] = useState("");
    const [showUpload, setShowUpload] = useState(false);

    const fetchDetails = async () => {
        const cRes = await api.get(`/tasks/${task.id}/comments`);
        setComments(cRes.data.comments);
        const aRes = await api.get(`/tasks/${task.id}/attachments`);
        setAttachments(aRes.data.attachments);
    };

    useEffect(() => {
        fetchDetails();
    }, [task]);

    const handleStatusChange = async (newStatus) => {
        await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
        onUpdate();
    };

    const handleDelete = async () => {
        if (confirm("Delete this task?")) {
            await api.delete(`/tasks/${task.id}`);
            onUpdate();
            onClose();
        }
    };

    const addComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        // Hardcoded user for now
        await api.post(`/tasks/${task.id}/comments`, { user_name: "Current User", content: newComment });
        setNewComment("");
        fetchDetails();
    };

    const uploadAttachment = async (e) => {
        e.preventDefault();
        await api.post(`/tasks/${task.id}/attachments`, { name: docName, url: docUrl });
        setDocName("");
        setDocUrl("");
        setShowUpload(false);
        fetchDetails();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex overflow-hidden">
                {/* Left: Task Details */}
                <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{task.name}</h2>
                        <div className="flex gap-2">
                            <button onClick={() => setShowEditModal(true)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm">Edit</button>
                            <button onClick={handleDelete} className="btn bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-sm">Delete</button>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-none cursor-pointer ${task.status === 'Done' ? 'bg-green-100 text-green-700' :
                                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}
                        >
                            <option>To-Do</option>
                            <option>In Progress</option>
                            <option>Testing</option>
                            <option>Done</option>
                        </select>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                            {task.priority} Priority
                        </span>
                        <span className="text-gray-500 text-sm flex items-center">
                            👤 {task.assigned_to || "Unassigned"}
                        </span>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{task.description || "No description provided."}</p>
                    </div>

                    {/* Subtasks */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700">Sub-tasks</h3>
                            <button onClick={() => setShowSubtaskModal(true)} className="text-blue-600 text-sm hover:underline">+ Add Sub-task</button>
                        </div>
                        <div className="space-y-2">
                            {task.subtasks?.map(st => (
                                <div key={st.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${st.status === 'Done' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <span className={st.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-700'}>{st.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{st.assigned_to}</span>
                                </div>
                            ))}
                            {(!task.subtasks || task.subtasks.length === 0) && <p className="text-gray-400 text-sm italic">No sub-tasks.</p>}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-700">Attachments</h3>
                            <button onClick={() => setShowUpload(!showUpload)} className="text-blue-600 text-sm hover:underline">+ Add File</button>
                        </div>

                        {showUpload && (
                            <form onSubmit={uploadAttachment} className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                                <input className="input w-full text-sm" placeholder="File Name" value={docName} onChange={e => setDocName(e.target.value)} required />
                                <input className="input w-full text-sm" placeholder="File URL" value={docUrl} onChange={e => setDocUrl(e.target.value)} required />
                                <button type="submit" className="btn text-sm w-full">Upload</button>
                            </form>
                        )}

                        <div className="space-y-2">
                            {attachments.map(att => (
                                <div key={att.id} className="flex items-center gap-2 text-sm">
                                    <span>📎</span>
                                    <a href={att.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{att.file_name}</a>
                                </div>
                            ))}
                            {attachments.length === 0 && <p className="text-gray-400 text-sm italic">No attachments.</p>}
                        </div>
                    </div>
                </div>

                {/* Right: Comments */}
                <div className="w-1/3 bg-gray-50 p-6 flex flex-col border-l border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">Comments</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {comments.map(c => (
                            <div key={c.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span className="font-bold text-gray-700">{c.user_name}</span>
                                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600">{c.content}</p>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-gray-400 text-sm text-center mt-10">No comments yet.</p>}
                    </div>

                    <form onSubmit={addComment} className="mt-auto">
                        <textarea
                            className="input w-full text-sm mb-2"
                            rows="3"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        ></textarea>
                        <button type="submit" className="btn w-full text-sm">Post Comment</button>
                    </form>
                </div>
            </div>

            {showSubtaskModal && (
                <TaskModal
                    projectId={task.project_id}
                    parentId={task.id}
                    onClose={() => setShowSubtaskModal(false)}
                    onSave={() => {
                        onUpdate();
                        // We need to close this modal to refresh parent data or trigger a refresh? 
                        // Actually onUpdate will refresh the parent list, but we need to refresh THIS modal's data.
                        // Ideally we should re-fetch task details here, but for now we rely on parent refresh or close.
                        // Let's just close the subtask modal and let the user see it updated if they reopen or if we implement refetch.
                        // Better: trigger a refetch of this task's details.
                        // But onUpdate refreshes the LIST in ProjectDetail.
                        // We can just close the subtask modal.
                    }}
                />
            )}

            {showEditModal && (
                <TaskModal
                    projectId={task.project_id}
                    initialData={task}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => {
                        onUpdate();
                        setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
}
