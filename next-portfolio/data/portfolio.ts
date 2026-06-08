export type Project = { id: number; url: string; title: string; desc?: string };

export const initialProjects: Project[] = [
  { id: 1, url: "https://example.com", title: "Exemplo", desc: "Projeto de exemplo" }
];
