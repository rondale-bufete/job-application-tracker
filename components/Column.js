"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ApplicationCard from "./ApplicationCard";
import { STATUS_COLORS } from "@/lib/statusColors";

export default function Column({ id, title, applications, onView }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const colors = STATUS_COLORS[id] || STATUS_COLORS.applied;

    return (
        <div className="flex-1 min-w-[270px]">
            <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${colors.bgTint}`}>
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <h2 className={`text-sm font-semibold ${colors.text}`}>{title}</h2>
                <span className={`text-xs ml-auto font-medium ${colors.text} opacity-70`}>
                    {applications.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={`rounded-xl p-2 min-h-[240px] transition-colors ${isOver ? "bg-white/[0.03]" : ""
                    }`}
            >
                <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} application={app} onView={onView} />
                    ))}
                </SortableContext>

                {applications.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-2xl mb-1 opacity-30">◌</p>
                        <p className="text-xs text-[#6E6A64]">No applications</p>
                    </div>
                )}
            </div>
        </div>
    );
}