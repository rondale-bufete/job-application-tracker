import { createClient } from "@/lib/supabase/client";

export async function getApplications() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function addApplication({ company, role, status = "applied", dateApplied, jobDescription }) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("applications")
        .insert({
            company,
            role,
            status,
            date_applied: dateApplied,
            job_description: jobDescription || null,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplication(id, updates) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplicationStatus(id, status) {
    return updateApplication(id, { status });
}

export async function deleteApplication(id) {
    const supabase = createClient();
    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) throw new Error(error.message);
}