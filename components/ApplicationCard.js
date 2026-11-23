"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { STATUS_COLORS } from "@/lib/statusColors";
import { formatDateOnly } from "@/lib/application-utils.mjs";

export default function ApplicationCard({ application, onView }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: application.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
    };

    const colors = STATUS_COLORS[application.status] || STATUS_COLORS.applied;
    const initial = application.company?.charAt(0).toUpperCase() || "?";

    return (
        <button
            type="button"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onView(application)}
            aria-label={`${application.company}, ${application.role}, applied ${formatDateOnly(application.date_applied)}`}
            className={`block w-full bg-[#1C1B1E] border border-l-4 ${colors.border} border-white/[0.06] rounded-xl p-4 mb-3 text-left cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm ${colors.avatarBg} ${colors.avatarText}`}
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate text-[#F4F3F1]">{application.company}</h3>
                    <p className="text-sm text-[#A29E97] mt-0.5 truncate">{application.role}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pl-12">
                <p className="text-xs text-[#6E6A64]">
                    {formatDateOnly(application.date_applied)}
                </p>
                {application.job_description && (
                    <span className="text-xs text-[#6E6A64]" title="Has job description">
                        📄
                    </span>
                )}
            </div>
        </button>
    );
}