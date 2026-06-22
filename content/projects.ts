export type Project = {
  slug: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  tags: string[]
  repo: string
  demo?: string
  image: string
  featured: boolean
  darkBg?: boolean
}

export const projects: Project[] = [
  {
    slug: 'streakfight',
    title: 'STREAKFIGHT',
    subtitle: 'Group Habit Tracker',
    description:
      'Compete with friends on daily habit streaks. Miss a day and you break the chain — the group watches, and the pressure is real. Built with React Native, FastAPI, Supabase, and Gemini 2.5 Flash for smart streak analysis.',
    highlights: [
      'Live group board updates in real-time via Supabase subscriptions — no polling needed',
      'Gemini 2.5 Flash analyzes habit patterns and delivers weekly AI coaching insights',
      'FastAPI handles streak logic, group management, and push notification triggers',
      'Cron-based miss-day detection flags breaks before users even open the app',
    ],
    tags: ['React Native', 'FastAPI', 'Supabase', 'Gemini 2.5 Flash', 'Python'],
    repo: 'https://github.com/Suhas-123-cell/streak',
    image: '/images/streak.png',
    featured: true,
    darkBg: true,
  },
  {
    slug: 'hallu-check',
    title: 'HALLU-CHECK',
    subtitle: 'LLM Hallucination Hunter',
    description:
      'Agentic pipeline that detects and surgically corrects LLM hallucinations claim-by-claim. Uses a fine-tuned DeBERTa NLI classifier for verification and web evidence retrieval — catching what the model got wrong before it ships.',
    highlights: [
      'DeBERTa NLI classifier runs inference locally — no external API calls for core verification',
      'Claim decomposition breaks long passages into atomic statements, checks each independently',
      'Web evidence retrieval cross-references every claim against live search results for grounding',
      'Claim-level precision: identifies exactly which sentences are wrong, not just the document',
    ],
    tags: ['Python', 'DeBERTa', 'LLaMA 3.2', 'Gemini', 'NLP', 'RAG'],
    repo: 'https://github.com/Suhas-123-cell/Hallu-Check',
    image: '/images/hallu-check.png',
    featured: false,
  },
  {
    slug: 'purplle',
    title: 'PURPLLE ANALYTICS',
    subtitle: 'Retail CCTV Intelligence',
    description:
      'Real-time customer analytics for 3 retail stores: foot traffic, demographic heatmaps, and dwell-time dashboards from live CCTV feeds. YOLOv8n handles the vision; FastAPI + SQLite handle the data; React shows the numbers.',
    highlights: [
      'YOLOv8n processes live CCTV feeds in real-time across 3 simultaneous store locations',
      'Demographic heatmaps reveal which floor zones attract peak dwell time by hour of day',
      'SQLite + FastAPI serves the React dashboard with sub-100ms aggregation queries',
      'Tested and validated in a production retail environment with real customer data',
    ],
    tags: ['YOLOv8', 'FastAPI', 'SQLite', 'React', 'Computer Vision', 'Python'],
    repo: 'https://github.com/Suhas-123-cell/purplle',
    image: '/images/purplle.png',
    featured: false,
    darkBg: true,
  },
  {
    slug: 'anigo',
    title: 'ANIGO',
    subtitle: 'AR Anime Collector Game',
    description:
      'Location-based AR mobile game where players explore the real world to discover and catch anime characters. Think Pokémon GO but with Naruto, One Piece, and Jujutsu Kaisen. Built with React Native/Expo, Node.js, and Supabase.',
    highlights: [
      'GPS-based spawn system: anime characters appear at real-world coordinates players must visit',
      'AR camera overlay built with Expo Camera API — no third-party AR SDK needed',
      'Supabase handles player profiles, character collections, and live global leaderboards',
      'Node.js backend manages character spawn logic and proximity detection boundary checks',
    ],
    tags: ['React Native', 'Expo', 'Node.js', 'Supabase', 'TypeScript'],
    repo: 'https://github.com/Suhas-123-cell/anigo',
    image: '/images/anigo.svg',
    featured: false,
    darkBg: true,
  },
  {
    slug: 'venture-radar',
    title: 'VENTURE RADAR',
    subtitle: 'B2B Opportunity Scout',
    description:
      'Type a B2B industry — get back ranked AI automation opportunities with investor-ready product briefs in 90 seconds. A 4-agent pipeline: research → competitor scan → opportunity scoring → brief writing. Turns days of manual discovery into one API call.',
    highlights: [
      '4-agent pipeline: industry research → competitor scan → opportunity scoring → brief writing',
      'Produces investor-ready product briefs from a single keyword in under 90 seconds',
      "Agents share context state — each agent's output feeds directly into the next agent's prompt",
      'FastAPI endpoint chains all agents sequentially with streaming progress feedback',
    ],
    tags: ['Python', 'Multi-Agent', 'LLM', 'RAG', 'FastAPI'],
    repo: 'https://github.com/Suhas-123-cell/Venture-Radar',
    image: '/images/venture-radar.png',
    featured: false,
  },
  {
    slug: 'rag-hotel',
    title: 'STAYCHAT',
    subtitle: 'Hotel RAG Chatbot',
    description:
      'Hotel QA system that answers guest questions from a curated knowledge base using hybrid retrieval — FAISS vector search + BM25 keyword matching — with Groq-hosted Llama. Zero hallucinations by design. Live on Hugging Face Spaces.',
    highlights: [
      'Hybrid retrieval: FAISS vector search + BM25 keyword matching, scores re-ranked by relevance',
      'Groq-hosted LLaMA 3 delivers sub-second response latency on the live deployment',
      'Strict grounding: model only answers from the knowledge base — zero hallucinations by design',
      'Live on Hugging Face Spaces with zero-downtime free-tier deployment, publicly accessible',
    ],
    tags: ['Python', 'FAISS', 'BM25', 'Groq', 'LLaMA', 'RAG'],
    repo: 'https://github.com/Suhas-123-cell/RAG-hotel',
    demo: 'https://huggingface.co/spaces/suhas20sh/staychat-rag',
    image: '/images/staychat.svg',
    featured: false,
    darkBg: true,
  },
]
