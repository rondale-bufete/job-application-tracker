export function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function getTaskBuckets(tasks, today = getLocalDateString()) {
    const openTasks = tasks.filter((task) => !task.completed_at);

    return {
        overdue: openTasks
            .filter((task) => task.due_date < today)
            .sort((a, b) => a.due_date.localeCompare(b.due_date)),
        today: openTasks
            .filter((task) => task.due_date === today)
            .sort((a, b) => a.due_date.localeCompare(b.due_date)),
        upcoming: openTasks
            .filter((task) => task.due_date > today)
            .sort((a, b) => a.due_date.localeCompare(b.due_date)),
    };
}

export function formatDateOnly(dateString, options = {}) {
    const date = new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        ...options,
    }).format(date);
}

export function getSafeHttpUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch {
        return null;
    }
}
