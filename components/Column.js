"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ApplicationCard from "./ApplicationCard";
import { STATUS_COLORS } from "@/lib/statusColors";

export default function Column({ id, title, applications, onView }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const colors = STATUS_COLORS[id] || STATUS_COLORS.applied;

    return (
        <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
                <span className="text-xs text-gray-400 ml-auto">{applications.length}</span>
            </div>

            <div
                ref={setNodeRef}
                className={`rounded-lg p-2 min-h-[200px] transition-colors ${isOver ? "bg-blue-50" : "bg-gray-50"
                    }`}
            >
                <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} application={app} onView={onView} />
                    ))}
                </SortableContext>

                {applications.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-6">No applications</p>
                )}
            </div>
        </div>
    );
}