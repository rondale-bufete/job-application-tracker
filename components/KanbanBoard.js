"use client";

import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "./AddApplicationModal";
import ApplicationDetailModal from "./ApplicationDetailModal";
import { updateApplicationStatus } from "@/lib/applications";
import { STATUS_COLORS } from "@/lib/statusColors";

const COLUMNS = [
    { id: "applied", title: "Applied" },
    { id: "interview", title: "Interview" },
    { id: "offer", title: "Offer" },
    { id: "rejected", title: "Rejected" },
];

export default function KanbanBoard({ initialApplications }) {
    const [applications, setApplications] = useState(initialApplications);
    const [activeId, setActiveId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewingApp, setViewingApp] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    function getColumnApplications(status) {
        return applications.filter((app) => app.status === status);
    }

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    async function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeApp = applications.find((a) => a.id === active.id);
        if (!activeApp) return;

        const overIsColumn = COLUMNS.some((col) => col.id === over.id);
        const newStatus = overIsColumn
            ? over.id
            : applications.find((a) => a.id === over.id)?.status;

        if (!newStatus || newStatus === activeApp.status) return;

        setApplications((prev) =>
            prev.map((app) => (app.id === activeApp.id ? { ...app, status: newStatus } : app))
        );

        try {
            await updateApplicationStatus(activeApp.id, newStatus);
        } catch (err) {
            setApplications((prev) =>
                prev.map((app) => (app.id === activeApp.id ? { ...app, status: activeApp.status } : app))
            );
        }
    }

    function handleAdded(newApp) {
        setApplications((prev) => [newApp, ...prev]);
    }

    function handleUpdated(updatedApp) {
        setApplications((prev) => prev.map((app) => (app.id === updatedApp.id ? updatedApp : app)));
        setViewingApp(updatedApp);
    }

    function handleDeleted(id) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
    }

    const activeApp = applications.find((a) => a.id === activeId);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="grid grid-cols-4 sm:flex gap-2 sm:gap-3">
                    {COLUMNS.map((col) => {
                        const colors = STATUS_COLORS[col.id];
                        const count = getColumnApplications(col.id).length;
                        return (
                            <div key={col.id} className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl ${colors.bgTint} text-center sm:text-left sm:min-w-[90px]`}>
                                <p className={`text-lg sm:text-xl font-semibold font-[family-name:var(--font-display)] ${colors.text}`}>
                                    {count}
                                </p>
                                <p className={`text-[10px] sm:text-xs ${colors.text} opacity-70 truncate`}>{col.title}</p>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#818CF8] text-[#121113] text-sm font-medium hover:bg-[#a5b0f9] transition-colors"
                >
                    + Add Application
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                    {COLUMNS.map((col) => (
                        <Column
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            applications={getColumnApplications(col.id)}
                            onView={setViewingApp}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeApp && <ApplicationCard application={activeApp} onView={() => { }} />}
                </DragOverlay>
            </DndContext>

            {showAddModal && (
                <AddApplicationModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
            )}

            {viewingApp && (
                <ApplicationDetailModal
                    application={viewingApp}
                    onClose={() => setViewingApp(null)}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}