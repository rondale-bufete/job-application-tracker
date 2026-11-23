"use client";

import { useMemo, useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "./Column";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "./AddApplicationModal";
import ApplicationDetailModal from "./ApplicationDetailModal";
import TaskModal from "./TaskModal";
import TaskPanel from "./TaskPanel";
import {
    addApplicationEvent,
    updateApplicationStatus,
    updateApplicationTask,
} from "@/lib/applications";
import { STATUS_COLORS } from "@/lib/statusColors";

const COLUMNS = [
    { id: "applied", title: "Applied" },
    { id: "interview", title: "Interview" },
    { id: "offer", title: "Offer" },
    { id: "rejected", title: "Rejected" },
];

export default function KanbanBoard({
    initialApplications,
    initialTasks,
    initialEvents,
    loadErrors,
}) {
    const [applications, setApplications] = useState(initialApplications);
    const [tasks, setTasks] = useState(initialTasks);
    const [events, setEvents] = useState(initialEvents);
    const [activeId, setActiveId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [viewingApp, setViewingApp] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [view, setView] = useState("board");
    const [notice, setNotice] = useState(null);
    const [busyTaskIds, setBusyTaskIds] = useState(() => new Set());

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const filteredApplications = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        return applications.filter((application) => {
            const matchesStatus = statusFilter === "all" || application.status === statusFilter;
            const matchesSearch =
                !query ||
                application.company.toLocaleLowerCase().includes(query) ||
                application.role.toLocaleLowerCase().includes(query) ||
                (application.location || "").toLocaleLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [applications, search, statusFilter]);

    function getColumnApplications(status, source = filteredApplications) {
        return source.filter((application) => application.status === status);
    }

    async function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeApp = applications.find((application) => application.id === active.id);
        if (!activeApp) return;

        const overIsColumn = COLUMNS.some((column) => column.id === over.id);
        const newStatus = overIsColumn
            ? over.id
            : applications.find((application) => application.id === over.id)?.status;

        if (!newStatus || newStatus === activeApp.status) return;

        setApplications((previous) =>
            previous.map((application) =>
                application.id === activeApp.id ? { ...application, status: newStatus } : application,
            ),
        );
        setNotice(null);

        try {
            const updated = await updateApplicationStatus(activeApp.id, newStatus);
            setApplications((previous) =>
                previous.map((application) => (application.id === updated.id ? updated : application)),
            );
        } catch (error) {
            setApplications((previous) =>
                previous.map((application) =>
                    application.id === activeApp.id ? { ...application, status: activeApp.status } : application,
                ),
            );
            setNotice(`Status could not be updated: ${error.message}`);
            return;
        }

        try {
            const event = await addApplicationEvent({
                applicationId: activeApp.id,
                eventType: "status_change",
                title: `Moved to ${COLUMNS.find((column) => column.id === newStatus)?.title || newStatus}`,
                body: `Moved from ${COLUMNS.find((column) => column.id === activeApp.status)?.title || activeApp.status}.`,
            });
            setEvents((previous) => [event, ...previous]);
        } catch (error) {
            setNotice(`Status was updated, but its activity could not be recorded: ${error.message}`);
        }
    }

    function handleAdded(newApp) {
        setApplications((previous) => [newApp, ...previous]);
        setNotice("Application added.");
    }

    function handleUpdated(updatedApp) {
        setApplications((previous) =>
            previous.map((application) => (application.id === updatedApp.id ? updatedApp : application)),
        );
        setViewingApp(updatedApp);
    }

    function handleDeleted(id) {
        setApplications((previous) => previous.filter((application) => application.id !== id));
        setTasks((previous) => previous.filter((task) => task.application_id !== id));
        setEvents((previous) => previous.filter((item) => item.application_id !== id));
    }

    function handleTaskAdded(task) {
        setTasks((previous) => [...previous, task]);
        setNotice("Follow-up scheduled.");
    }

    function handleEventAdded(event) {
        setEvents((previous) => [event, ...previous]);
    }

    async function handleCompleteTask(task) {
        setBusyTaskIds((previous) => new Set(previous).add(task.id));
        setNotice(null);
        try {
            const updatedTask = await updateApplicationTask(task.id, true);
            setTasks((previous) =>
                previous.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
            );
            setNotice("Follow-up marked complete.");
        } catch (error) {
            setNotice(`Follow-up could not be completed: ${error.message}`);
        } finally {
            setBusyTaskIds((previous) => {
                const next = new Set(previous);
                next.delete(task.id);
                return next;
            });
        }
    }

    const activeApp = applications.find((application) => application.id === activeId);
    const visibleColumns = statusFilter === "all"
        ? COLUMNS
        : COLUMNS.filter((column) => column.id === statusFilter);
    const applicationEvents = viewingApp
        ? events.filter((event) => event.application_id === viewingApp.id)
        : [];
    const totalOpenTasks = tasks.filter((task) => !task.completed_at).length;

    return (
        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7">
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A29E97]">Your search</p>
                    <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[#F4F3F1] sm:text-3xl">
                        Job search dashboard
                    </h1>
                    <p className="mt-2 text-sm text-[#A29E97]">
                        {applications.length} application{applications.length === 1 ? "" : "s"} · {totalOpenTasks} open follow-up{totalOpenTasks === 1 ? "" : "s"}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex">
                    <button
                        type="button"
                        onClick={() => setShowTaskModal(true)}
                        disabled={applications.length === 0 || Boolean(loadErrors.tasks)}
                        className="min-h-11 rounded-xl border border-white/10 px-4 text-sm font-medium text-[#F4F3F1] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                        title={loadErrors.tasks ? "Apply the Supabase migration to enable follow-ups." : undefined}
                    >
                        + Follow-up
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="min-h-11 rounded-xl bg-[#818CF8] px-4 text-sm font-semibold text-[#121113] hover:bg-[#98A6FF]"
                    >
                        + Add application
                    </button>
                </div>
            </header>

            {loadErrors.applications && (
                <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
                    <span>Applications could not be loaded. Check your connection and database access.</span>
                    <button type="button" onClick={() => window.location.reload()} className="min-h-10 rounded-lg border border-red-200/20 px-3 hover:bg-white/5">
                        Try again
                    </button>
                </div>
            )}
            {(loadErrors.tasks || loadErrors.events) && (
                <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">
                    <span>
                        Follow-ups and activity need the latest database schema. Apply{" "}
                        <code className="rounded bg-black/20 px-1.5 py-0.5">supabase/migrations/20261121000000_add_application_workflow.sql</code>
                        {" "}then reload.
                    </span>
                    <button type="button" onClick={() => window.location.reload()} className="min-h-10 rounded-lg border border-amber-100/20 px-3 hover:bg-white/5">
                        Reload
                    </button>
                </div>
            )}
            {notice && (
                <p role="status" aria-live="polite" className="mb-4 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-sm text-amber-100">
                    {notice}
                </p>
            )}

            <TaskPanel
                tasks={tasks}
                applications={applications}
                onComplete={handleCompleteTask}
                onOpenApplication={setViewingApp}
                busyTaskIds={busyTaskIds}
            />

            <section aria-label="Application pipeline">
                <div className="mb-4 flex flex-col gap-3 rounded-xl border border-white/8 bg-[#17151A] p-3 sm:flex-row sm:items-center">
                    <label className="min-w-0 flex-1">
                        <span className="sr-only">Search applications</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search company, role, or location"
                            className="min-h-11 w-full rounded-lg border border-white/10 bg-[#121113] px-3 text-sm text-[#F4F3F1] placeholder:text-[#827D77] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]"
                        />
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <label className="flex items-center gap-2 text-sm text-[#A29E97]">
                            <span className="sr-only">Filter by status</span>
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="min-h-11 w-full rounded-lg border border-white/10 bg-[#121113] px-3 text-sm text-[#F4F3F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8] sm:w-auto"
                            >
                                <option value="all">All statuses</option>
                                {COLUMNS.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
                            </select>
                        </label>
                        <div className="flex rounded-lg border border-white/10 p-1" role="group" aria-label="Application view">
                            <button type="button" aria-pressed={view === "board"} onClick={() => setView("board")} className={`min-h-11 rounded-md px-3 text-sm ${view === "board" ? "bg-white/10 text-[#F4F3F1]" : "text-[#A29E97]"}`}>
                                Board
                            </button>
                            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`min-h-11 rounded-md px-3 text-sm ${view === "list" ? "bg-white/10 text-[#F4F3F1]" : "text-[#A29E97]"}`}>
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {view === "board" ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={(event) => setActiveId(event.active.id)}
                        onDragEnd={handleDragEnd}
                        onDragCancel={() => setActiveId(null)}
                    >
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                            {visibleColumns.map((column) => (
                                <Column
                                    key={column.id}
                                    id={column.id}
                                    title={column.title}
                                    applications={getColumnApplications(column.id)}
                                    onView={setViewingApp}
                                />
                            ))}
                        </div>
                        <DragOverlay>
                            {activeApp && <ApplicationCard application={activeApp} onView={() => {}} />}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#17151A]">
                        {filteredApplications.length === 0 ? (
                            <p className="p-8 text-center text-sm text-[#A29E97]">
                                {applications.length ? "No applications match these filters." : "Add your first application to start building your pipeline."}
                            </p>
                        ) : (
                            <>
                                <ul className="divide-y divide-white/5 md:hidden">
                                    {filteredApplications.map((application) => (
                                        <li key={application.id}>
                                            <button
                                                type="button"
                                                onClick={() => setViewingApp(application)}
                                                className="w-full p-4 text-left hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#818CF8]"
                                            >
                                                <span className="flex items-center justify-between gap-3">
                                                    <span className="font-medium text-[#F4F3F1]">{application.company}</span>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLORS[application.status]?.bgTint || "bg-white/10"} ${STATUS_COLORS[application.status]?.text || "text-[#F4F3F1]"}`}>
                                                        {COLUMNS.find((column) => column.id === application.status)?.title || application.status}
                                                    </span>
                                                </span>
                                                <span className="mt-1 block text-sm text-[#A29E97]">{application.role}</span>
                                                <span className="mt-2 block text-xs text-[#827D77]">
                                                    Applied {application.date_applied}{application.location ? ` · ${application.location}` : ""}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[640px] text-left text-sm">
                                        <thead className="border-b border-white/8 text-xs uppercase tracking-wide text-[#827D77]">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 font-medium">Company</th>
                                                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                                                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                                                <th scope="col" className="px-4 py-3 font-medium">Applied</th>
                                                <th scope="col" className="px-4 py-3 font-medium">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredApplications.map((application) => (
                                                <tr key={application.id} className="hover:bg-white/[0.03]">
                                                    <th scope="row" className="px-4 py-3 font-medium text-[#F4F3F1]">
                                                        <button type="button" onClick={() => setViewingApp(application)} className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#818CF8]">
                                                            {application.company}
                                                        </button>
                                                    </th>
                                                    <td className="px-4 py-3 text-[#A29E97]">{application.role}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLORS[application.status]?.bgTint || "bg-white/10"} ${STATUS_COLORS[application.status]?.text || "text-[#F4F3F1]"}`}>
                                                            {COLUMNS.find((column) => column.id === application.status)?.title || application.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-[#A29E97]">{application.date_applied}</td>
                                                    <td className="px-4 py-3 text-[#A29E97]">{application.location || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </section>

            {showAddModal && (
                <AddApplicationModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
            )}
            {showTaskModal && (
                <TaskModal
                    applications={applications}
                    onClose={() => setShowTaskModal(false)}
                    onAdded={handleTaskAdded}
                />
            )}
            {viewingApp && (
                <ApplicationDetailModal
                    key={viewingApp.id}
                    application={viewingApp}
                    events={applicationEvents}
                    activityError={loadErrors.events}
                    onClose={() => setViewingApp(null)}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                    onEventAdded={handleEventAdded}
                />
            )}
        </main>
    );
}
