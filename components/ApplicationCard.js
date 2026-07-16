"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { STATUS_COLORS } from "@/lib/statusColors";

export default function ApplicationCard({ application, onView }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: application.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const colors = STATUS_COLORS[application.status] || STATUS_COLORS.applied;
    const initial = application.company?.charAt(0).toUpperCase() || "?";

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onView(application)}
            className={`bg-white border border-l-4 ${colors.border} border-black/5 rounded-xl p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm ${colors.avatarBg} ${colors.avatarText}`}
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{application.company}</h3>
                    <p className="text-sm text-[#6B6862] mt-0.5 truncate">{application.role}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pl-12">
                <p className="text-xs text-[#9B9791]">
                    {new Date(application.date_applied).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                    })}
                </p>
                {application.job_description && (
                    <span className="text-xs text-[#9B9791]" title="Has job description">
                        📄
                    </span>
                )}
            </div>
        </div>
    );
}