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
            activationConstraint: {
                distance: 8, // require 8px of movement before a drag starts, so clicks still work
            },
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

        // Optimistic update
        setApplications((prev) =>
            prev.map((app) => (app.id === activeApp.id ? { ...app, status: newStatus } : app))
        );

        try {
            await updateApplicationStatus(activeApp.id, newStatus);
        } catch (err) {
            // Revert on failure
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{applications.length} total applications</p>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
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
                <div className="flex gap-4 overflow-x-auto pb-4">
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