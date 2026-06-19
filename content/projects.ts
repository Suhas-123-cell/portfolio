export type Project = {
  slug: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  repo: string
  demo?: string
  image: string
  featured: boolean
}

const GH = 'https://opengraph.githubassets.com/1/Suhas-123-cell'

export const projects: Project[] = [
  {
    slug: 'streakfight',
    title: 'STREAKFIGHT',
    subtitle: 'Group Habit Tracker',
    description:
      'Compete with friends on daily habit streaks. Miss a day and you break the chain — the group watches, and the pressure is real. Built with React Native, FastAPI, Supabase, and Gemini 2.5 Flash for smart streak analysis.',
    tags: ['React Native', 'FastAPI', 'Supabase', 'Gemini 2.5 Flash', 'Python'],
    repo: 'https://github.com/Suhas-123-cell/streak',
    image: `${GH}/streak`,
    featured: true,
  },
  {
    slug: 'hallu-check',
    title: 'HALLU-CHECK',
    subtitle: 'LLM Hallucination Hunter',
    description:
      'Agentic pipeline that detects and surgically corrects LLM hallucinations claim-by-claim. Uses a fine-tuned DeBERTa NLI classifier for verification and web evidence retrieval — catching what the model got wrong before it ships.',
    tags: ['Python', 'DeBERTa', 'LLaMA 3.2', 'Gemini', 'NLP', 'RAG'],
    repo: 'https://github.com/Suhas-123-cell/Hallu-Check',
    image: `${GH}/Hallu-Check`,
    featured: true,
  },
  {
    slug: 'purplle',
    title: 'PURPLLE ANALYTICS',
    subtitle: 'Retail CCTV Intelligence',
    description:
      'Real-time customer analytics for 3 retail stores: foot traffic, demographic heatmaps, and dwell-time dashboards from live CCTV feeds. YOLOv8n handles the vision; FastAPI + SQLite handle the data; React shows the numbers.',
    tags: ['YOLOv8', 'FastAPI', 'SQLite', 'React', 'Computer Vision', 'Python'],
    repo: 'https://github.com/Suhas-123-cell/purplle',
    image: `${GH}/purplle`,
    featured: true,
  },
  {
    slug: 'anigo',
    title: 'ANIGO',
    subtitle: 'AR Anime Collector Game',
    description:
      'Location-based AR mobile game where players explore the real world to discover and catch anime characters. Think Pokémon GO but with Naruto, One Piece, and Jujutsu Kaisen. Built with React Native/Expo, Node.js, and Supabase.',
    tags: ['React Native', 'Expo', 'Node.js', 'Supabase', 'TypeScript'],
    repo: 'https://github.com/Suhas-123-cell/anigo',
    image: `${GH}/anigo`,
    featured: true,
  },
  {
    slug: 'customer-support',
    title: 'AI SUPPORT HUB',
    subtitle: 'Intelligent Ticket Platform',
    description:
      'AI-powered customer support that automates ticket routing, surfaces relevant knowledge via vector search, and runs dual chatbots — one for customers, one assisting agents. Built on React, FastAPI, and GPT-4o.',
    tags: ['React', 'FastAPI', 'GPT-4o', 'Vector Search', 'Python', 'TypeScript'],
    repo: 'https://github.com/Suhas-123-cell/customer-support',
    image: `${GH}/customer-support`,
    featured: false,
  },
  {
    slug: 'rag-hotel',
    title: 'STAYCHAT',
    subtitle: 'Hotel RAG Chatbot',
    description:
      'Hotel QA system that answers guest questions from a curated knowledge base using hybrid retrieval — FAISS vector search + BM25 keyword matching — with Groq-hosted Llama. Zero hallucinations by design.',
    tags: ['Python', 'FAISS', 'BM25', 'Groq', 'LLaMA', 'RAG'],
    repo: 'https://github.com/Suhas-123-cell/RAG-hotel',
    image: `${GH}/RAG-hotel`,
    featured: false,
  },
]
