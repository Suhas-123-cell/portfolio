export type SkillGroup = { name: string; skills: string[] }

// Grouped by what I reach for, not self-rated percentages.
export const skillGroups: SkillGroup[] = [
  { name: 'AI / ML', skills: ['LLM agents', 'RAG', 'NLI / NLP', 'LangGraph', 'YOLOv8', 'scikit-learn', 'Evaluation'] },
  { name: 'Backend', skills: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Supabase', 'WebSockets'] },
  { name: 'Frontend', skills: ['React', 'TypeScript', 'React Native', 'Next.js', 'Tailwind'] },
  { name: 'Ops', skills: ['Docker', 'GitHub Actions', 'Vercel', 'Hugging Face', 'pytest'] },
]
