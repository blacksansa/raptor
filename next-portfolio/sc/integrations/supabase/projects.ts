import supabase from "./client";

export type ProjectRow = {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  created_at?: string | null;
};

export async function listProjects(): Promise<ProjectRow[]> {
  const res = await supabase.from<ProjectRow>("projects").select("*").order("created_at", { ascending: false });
  console.debug('listProjects response:', res)
  const { data, error } = res
  if (error) throw error;
  return data ?? [];
}

export async function createProject(p: Omit<ProjectRow, "id" | "created_at">): Promise<ProjectRow> {
  const res = await supabase.from<ProjectRow>("projects").insert(p).select().single();
  console.debug('createProject response:', res)
  const { data, error } = res
  if (error) throw error;
  return data as ProjectRow;
}

export async function deleteProject(id: number): Promise<void> {
  const res = await supabase.from("projects").delete().eq("id", id);
  console.debug('deleteProject response:', res)
  const { error } = res
  if (error) throw error;
}
