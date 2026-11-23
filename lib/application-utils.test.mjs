import assert from "node:assert/strict";
import test from "node:test";
import { getLocalDateString, getSafeHttpUrl, getTaskBuckets } from "./application-utils.mjs";

test("formats a local date without converting it through UTC", () => {
    assert.equal(getLocalDateString(new Date(2026, 10, 21, 0, 15)), "2026-11-21");
});

test("groups open tasks by due date and excludes completed tasks", () => {
    const buckets = getTaskBuckets(
        [
            { id: "late", due_date: "2026-11-20", completed_at: null },
            { id: "today", due_date: "2026-11-21", completed_at: null },
            { id: "future", due_date: "2026-11-23", completed_at: null },
            { id: "done", due_date: "2026-11-19", completed_at: "2026-11-20T08:00:00Z" },
        ],
        "2026-11-21",
    );

    assert.deepEqual(buckets.overdue.map((task) => task.id), ["late"]);
    assert.deepEqual(buckets.today.map((task) => task.id), ["today"]);
    assert.deepEqual(buckets.upcoming.map((task) => task.id), ["future"]);
});

test("only exposes web URLs as job posting links", () => {
    assert.equal(getSafeHttpUrl("https://example.com/job"), "https://example.com/job");
    assert.equal(getSafeHttpUrl("javascript:alert(1)"), null);
    assert.equal(getSafeHttpUrl("not a url"), null);
});
