import supabase from "./client";

export type ProjectRow = {
  id: number;
  title: string;
  url: string;
  desc?: string | null;
  created_at?: string | null;
};

export async function listProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase.from<ProjectRow>("projects").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProject(p: Omit<ProjectRow, "id" | "created_at">): Promise<ProjectRow> {
  const { data, error } = await supabase.from<ProjectRow>("projects").insert(p).select().single();
  if (error) throw error;
  return data as ProjectRow;
}

export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
