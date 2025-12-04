import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useState } from "react";

export default function GanttChart({ tasks }) {
    const [viewMode, setViewMode] = useState(ViewMode.Day);

    if (!tasks || tasks.length === 0) {
        return <div className="p-8 text-center text-gray-500">No tasks available for timeline.</div>;
    }

    // Transform tasks for the library
    const ganttTasks = tasks.map(task => ({
        start: new Date(task.start_date || new Date()),
        end: new Date(task.end_date || new Date()),
        name: task.name,
        id: String(task.id),
        type: "task",
        progress: task.status === "Done" ? 100 : task.status === "In Progress" ? 50 : 0,
        isDisabled: true,
        styles: { progressColor: "#3b82f6", progressSelectedColor: "#2563eb" },
    }));

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-end gap-2 mb-4">
                <button onClick={() => setViewMode(ViewMode.Day)} className={`px-3 py-1 text-sm rounded ${viewMode === ViewMode.Day ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>Day</button>
                <button onClick={() => setViewMode(ViewMode.Week)} className={`px-3 py-1 text-sm rounded ${viewMode === ViewMode.Week ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>Week</button>
                <button onClick={() => setViewMode(ViewMode.Month)} className={`px-3 py-1 text-sm rounded ${viewMode === ViewMode.Month ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>Month</button>
            </div>
            <div className="overflow-x-auto">
                <Gantt
                    tasks={ganttTasks}
                    viewMode={viewMode}
                    columnWidth={viewMode === ViewMode.Month ? 300 : 65}
                    listCellWidth="155px"
                    barFill={60}
                    ganttHeight={300}
                />
            </div>
        </div>
    );
}
