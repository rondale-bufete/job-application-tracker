import { createClient } from "@/lib/supabase/client";

const APPLICATION_STATUSES = new Set(["applied", "interview", "offer", "rejected"]);
const APPLICATION_FIELDS = new Set([
    "company",
    "role",
    "status",
    "date_applied",
    "job_description",
    "job_url",
    "location",
    "salary_range",
    "contact_name",
    "contact_email",
]);

async function getAuthenticatedUser(supabase) {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);
    if (!user) throw new Error("Please sign in again to continue.");

    return user;
}

function requireText(value, fieldName, maxLength = 200) {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) throw new Error(`${fieldName} is required.`);
    if (text.length > maxLength) throw new Error(`${fieldName} must be ${maxLength} characters or fewer.`);
    return text;
}

function optionalText(value, fieldName, maxLength) {
    if (value == null) return null;
    if (typeof value !== "string") throw new Error(`${fieldName} must be text.`);

    const text = value.trim();
    if (text.length > maxLength) throw new Error(`${fieldName} must be ${maxLength} characters or fewer.`);
    return text || null;
}

function validateJobUrl(value) {
    const text = optionalText(value, "Job posting URL", 2048);
    if (!text) return null;

    let url;
    try {
        url = new URL(text);
    } catch {
        throw new Error("Enter a valid job posting URL.");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Job posting URL must start with http:// or https://.");
    }

    return text;
}

function validateEmail(value) {
    const text = optionalText(value, "Contact email", 254);
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        throw new Error("Enter a valid contact email address.");
    }
    return text;
}

function validateDate(value, fieldName) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`${fieldName} must be a valid date.`);
    }

    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        throw new Error(`${fieldName} must be a valid date.`);
    }
}

export async function getApplications() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function addApplication({
    company,
    role,
    status = "applied",
    dateApplied,
    jobDescription,
    jobUrl,
    location,
    salaryRange,
    contactName,
    contactEmail,
}) {
    const supabase = createClient();
    const user = await getAuthenticatedUser(supabase);
    const safeCompany = requireText(company, "Company");
    const safeRole = requireText(role, "Role");
    if (!APPLICATION_STATUSES.has(status)) throw new Error("Choose a valid application status.");
    validateDate(dateApplied, "Application date");

    const { data, error } = await supabase
        .from("applications")
        .insert({
            company: safeCompany,
            role: safeRole,
            status,
            date_applied: dateApplied,
            job_description: optionalText(jobDescription, "Job description", 20000),
            job_url: validateJobUrl(jobUrl),
            location: optionalText(location, "Location", 200),
            salary_range: optionalText(salaryRange, "Salary range", 100),
            contact_name: optionalText(contactName, "Contact name", 200),
            contact_email: validateEmail(contactEmail),
            user_id: user.id,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplication(id, updates) {
    const supabase = createClient();
    const user = await getAuthenticatedUser(supabase);
    const unknownFields = Object.keys(updates).filter((field) => !APPLICATION_FIELDS.has(field));
    if (unknownFields.length > 0) throw new Error("The application contains unsupported changes.");
    const safeUpdates = { ...updates };

    if (Object.keys(safeUpdates).length === 0) throw new Error("There are no valid changes to save.");
    if (safeUpdates.company !== undefined) safeUpdates.company = requireText(safeUpdates.company, "Company");
    if (safeUpdates.role !== undefined) safeUpdates.role = requireText(safeUpdates.role, "Role");
    if (safeUpdates.date_applied !== undefined) validateDate(safeUpdates.date_applied, "Application date");
    if (safeUpdates.status !== undefined && !APPLICATION_STATUSES.has(safeUpdates.status)) {
        throw new Error("Choose a valid application status.");
    }
    if (safeUpdates.job_description !== undefined) safeUpdates.job_description = optionalText(safeUpdates.job_description, "Job description", 20000);
    if (safeUpdates.job_url !== undefined) safeUpdates.job_url = validateJobUrl(safeUpdates.job_url);
    if (safeUpdates.location !== undefined) safeUpdates.location = optionalText(safeUpdates.location, "Location", 200);
    if (safeUpdates.salary_range !== undefined) safeUpdates.salary_range = optionalText(safeUpdates.salary_range, "Salary range", 100);
    if (safeUpdates.contact_name !== undefined) safeUpdates.contact_name = optionalText(safeUpdates.contact_name, "Contact name", 200);
    if (safeUpdates.contact_email !== undefined) safeUpdates.contact_email = validateEmail(safeUpdates.contact_email);

    const { data, error } = await supabase
        .from("applications")
        .update(safeUpdates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplicationStatus(id, status) {
    return updateApplication(id, { status });
}

export async function addApplicationTask({ applicationId, title, notes, dueDate }) {
    const supabase = createClient();
    const user = await getAuthenticatedUser(supabase);
    validateDate(dueDate, "Due date");

    const { data, error } = await supabase
        .from("application_tasks")
        .insert({
            application_id: applicationId,
            user_id: user.id,
            title: requireText(title, "Task title"),
            notes: optionalText(notes, "Follow-up notes", 5000),
            due_date: dueDate,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplicationTask(id, completed) {
    const supabase = createClient();
    const user = await getAuthenticatedUser(supabase);
    const { data, error } = await supabase
        .from("application_tasks")
        .update({ completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function addApplicationEvent({ applicationId, eventType, title, body }) {
    const supabase = createClient();
    const user = await getAuthenticatedUser(supabase);
    if (!["note", "interview", "status_change"].includes(eventType)) {
        throw new Error("Choose a valid activity type.");
    }

    const { data, error } = await supabase
        .from("application_events")
        .insert({
            application_id: applicationId,
            user_id: user.id,
            event_type: eventType,
            title: requireText(title, "Activity title"),
            body: optionalText(body, "Activity details", 5000),
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteApplication(id) {
    const supabase = createClient();
    const user = await getAuthenticatedUser(supabase);
    const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) throw new Error(error.message);
}