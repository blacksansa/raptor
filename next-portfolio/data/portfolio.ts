export type Project = { id: number; url: string; title: string; description?: string };

export const initialProjects: Project[] = [
  { id: 1, url: "https://example.com", title: "Exemplo", description: "Projeto de exemplo" }
];
