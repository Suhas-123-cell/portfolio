export type Skill = {
  name: string
  level: number   // 0-100
  category: 'AI/ML' | 'Backend' | 'Frontend' | 'DevOps'
}

export const skills: Skill[] = [
  { name: 'Machine Learning', level: 85, category: 'AI/ML'    },
  { name: 'AI Agents',        level: 88, category: 'AI/ML'    },
  { name: 'Agentic AI',       level: 86, category: 'AI/ML'    },
  { name: 'RAG / NLP',        level: 82, category: 'AI/ML'    },
  { name: 'LLM Prompting',    level: 90, category: 'AI/ML'    },
  { name: 'Python',           level: 92, category: 'Backend'  },
  { name: 'FastAPI',          level: 88, category: 'Backend'  },
  { name: 'Supabase / SQL',   level: 72, category: 'Backend'  },
  { name: 'Node.js',          level: 68, category: 'Backend'  },
  { name: 'React',            level: 82, category: 'Frontend' },
  { name: 'JavaScript',       level: 85, category: 'Frontend' },
  { name: 'React Native',     level: 78, category: 'Frontend' },
  { name: 'Docker',           level: 65, category: 'DevOps'   },
]
