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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onView(application)}
            className={`bg-white border border-l-4 ${colors.border} border-gray-200 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow`}
        >
            <h3 className="font-medium text-sm">{application.company}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{application.role}</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                    {new Date(application.date_applied).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
                {application.job_description && (
                    <span className="text-xs text-gray-400" title="Has job description">
                        📄
                    </span>
                )}
            </div>
        </div>
    );
}