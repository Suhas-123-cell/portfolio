export type Skill = {
  name: string
  level: number   // 0-100
  category: 'AI/ML' | 'Backend' | 'Frontend' | 'DevOps'
}

export const skills: Skill[] = [
  { name: 'Python',           level: 92, category: 'Backend'  },
  { name: 'Machine Learning', level: 85, category: 'AI/ML'    },
  { name: 'Computer Vision',  level: 80, category: 'AI/ML'    },
  { name: 'RAG / NLP',        level: 82, category: 'AI/ML'    },
  { name: 'FastAPI',          level: 88, category: 'Backend'  },
  { name: 'React Native',     level: 78, category: 'Frontend' },
  { name: 'Next.js',          level: 74, category: 'Frontend' },
  { name: 'TypeScript',       level: 72, category: 'Frontend' },
  { name: 'Supabase / SQL',   level: 72, category: 'Backend'  },
  { name: 'Node.js',          level: 68, category: 'Backend'  },
  { name: 'Docker',           level: 65, category: 'DevOps'   },
  { name: 'LLM Prompting',    level: 88, category: 'AI/ML'    },
]
