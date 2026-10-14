export type Project = {
  slug: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  tags: string[]
  repo: string
  demo?: string
  /** Real screenshot, shown clean on the cover. */
  image?: string
  /** One real, sourced number shown big on the comic cover. */
  stat?: { value: string; label: string }
  /** Comic sound effect, used in the intro's panel strip. */
  sfx: string
  /** Shown in the cover masthead. */
  domain: string
  status: 'Active' | 'Shipped' | 'Live' | 'On PyPI'
  featured: boolean
  period: string
}

export const projects: Project[] = [
  {
    slug: 'intentshield',
    sfx: 'BLOCKED!',
    domain: 'AI safety',
    status: 'Active',
    title: 'IntentShield',
    subtitle: 'Guardrail for AI agents',
    description:
      'An offline-first security gateway for tool-using AI agents. Every MCP tool call is judged ALLOW, REVIEW or BLOCK before any side effect happens, through hooks for Claude Code, Codex CLI, Cursor and Gemini CLI plus a transparent MCP proxy.',
    highlights: [
      'On 220 held-out MSB attacks against live MCP servers, executed harm fell from 58.5% to 0.0%',
      'A trivial baseline also hit 0%, so I measured the real gain: 0 harmful calls left for human review, against 47 for the baseline',
      'Deterministic policy with reason codes, tool-poisoning and rug-pull detection, and output taint tracking that blocks attacker-supplied arguments',
      'Human approval is bound to the exact call and expires; negative results are documented too (an injection classifier flagged 24% of benign text)',
    ],
    tags: ['Python', 'MCP', 'FastAPI', 'SQLite', 'Agent security'],
    repo: 'https://github.com/Suhas-123-cell/IntentShield',
    image: '/images/intentshield.png',
    stat: { value: '58.5% → 0%', label: 'harmful tool calls executed' },
    featured: true,
    period: 'Sep 2026 - now',
  },
  {
    slug: 'fabguard-ai',
    sfx: 'KRRRK!',
    domain: 'Industrial AI',
    status: 'Active',
    title: 'FabGuard AI',
    subtitle: 'Bearing condition monitoring',
    description:
      'A fault-detection pipeline over paired 42 kHz vibration and acoustic signals from 20 bearings, evaluated with nested leave-one-bearing-out cross-validation so the model never sees the bearing it is judged on. A human-in-the-loop agent writes the inspection report.',
    highlights: [
      'Fusion Isolation Forest trained only on healthy data: 0.955 balanced accuracy and 98.9% developing-fault recall at 5.6% false positives over 15 held-out bearings',
      'FFT band-power, RMS, kurtosis and crest-factor features; 8.6 ms per window on CPU',
      'A confound audit exposed a load shortcut, so the 5 affected bearings were excluded from the headline result',
      'LangGraph agent over hybrid pgvector + full-text retrieval; a deterministic verifier fails closed on any report whose numbers differ from the model output',
      'PostgreSQL checkpointing survives a worker crash; role-gated FastAPI, idempotent approvals, 68 tests in GitHub Actions CI',
    ],
    tags: ['scikit-learn', 'LangGraph', 'PostgreSQL', 'FastAPI', 'Signals'],
    repo: 'https://github.com/Suhas-123-cell/FabGuard-AI',
    image: '/images/fabguard.png',
    stat: { value: '0.955', label: 'balanced accuracy, unseen bearings' },
    featured: true,
    period: 'Sep 2026 - now',
  },
  {
    slug: 'hallu-check',
    sfx: 'FALSE!',
    domain: 'LLM evaluation',
    status: 'Shipped',
    title: 'Hallu-Check',
    subtitle: 'Hallucination detection',
    description:
      'An 8-node agentic pipeline that checks LLM answers claim by claim. A two-stage router sends each claim to NLI, SymPy, or LLM-written unit tests in a sandbox, corrective RAG grades every retrieved chunk, and wrong claims go through up to 3 refine-and-reverify rounds.',
    highlights: [
      'Fine-tuned DeBERTa-v3-base on 392K MNLI pairs as a local claim verifier, about 42 ms per claim',
      'Two-stage router: regex rules first, LLM fallback second',
      'Corrective RAG grades each scraped chunk with an LLM judge and rewrites the query when nothing is relevant',
      'Math claims go to SymPy; code claims get LLM-written unit tests run in a sandboxed subprocess',
    ],
    tags: ['PyTorch', 'DeBERTa-v3', 'FastAPI', 'Corrective RAG'],
    repo: 'https://github.com/Suhas-123-cell/Hallu-Check',
    image: '/images/hallu-check.png',
    stat: { value: '42 ms', label: 'per claim, verified locally' },
    featured: true,
    period: 'Jan - May 2026',
  },
  {
    slug: 'autoreply',
    sfx: 'DING!',
    domain: 'Mobile + web',
    status: 'Active',
    title: 'AutoReply',
    subtitle: 'Comment-to-DM automation',
    description:
      'Someone comments LINK on your reel and gets a DM with your link a second later. Open-source Instagram and Telegram comment-to-DM automation on the official Meta and Telegram APIs, with a native mobile app for running campaigns. No scraping, no browser automation, no passwords.',
    highlights: [
      'Keyword matching with whole-word, partial, typo and plural tolerance',
      'Official Instagram private replies and Telegram Bot API, so accounts stay inside platform rules',
      'React Native operator app for iOS and Android; Next.js service for the API and tracked redirects',
      'Free to self-host for a single account instead of another monthly subscription',
    ],
    tags: ['TypeScript', 'Next.js', 'React Native', 'Meta API', 'Telegram'],
    repo: 'https://github.com/Suhas-123-cell/AutoReply',
    featured: true,
    period: '2026',
  },
  {
    slug: 'totp-strict',
    sfx: 'TICK!',
    domain: 'Security library',
    status: 'On PyPI',
    title: 'totp-strict',
    subtitle: 'RFC-exact TOTP for Python',
    description:
      'A zero-dependency TOTP and HOTP library published on PyPI. It exists because the popular option silently fails the RFC 6238 SHA-512 test vectors: errata 2866 says the key length must match the hash block size, and totp-strict enforces it.',
    highlights: [
      'Passes all 18 RFC 6238 test vectors across SHA-1, SHA-256 and SHA-512',
      'Zero external dependencies, CI on every push, published to PyPI',
      'Documents exactly where and why pyotp diverges from the spec',
    ],
    tags: ['Python', 'Security', 'RFC 6238', 'PyPI'],
    repo: 'https://github.com/Suhas-123-cell/totp-strict',
    demo: 'https://pypi.org/project/totp-strict/',
    stat: { value: '18/18', label: 'RFC test vectors' },
    featured: false,
    period: '2026',
  },
  {
    slug: 'remote-terminal',
    sfx: 'TAP TAP!',
    domain: 'Mobile + infra',
    status: 'Shipped',
    title: 'Remote Terminal',
    subtitle: 'Your laptop, from your phone',
    description:
      'A native mobile app that turns a phone into a full remote terminal and remote screen for a laptop. Multiple real shells over WebSockets, a special-keys toolbar above the keyboard, and a live desktop view where taps become real mouse clicks.',
    highlights: [
      'Node.js server runs real shells on pseudo-terminals (node-pty) over token-protected WebSockets',
      'Expo app renders each terminal with xterm.js, with tabs and sticky Ctrl',
      'Screen mode streams the macOS desktop and injects mouse and keyboard input',
    ],
    tags: ['TypeScript', 'React Native', 'Node.js', 'WebSockets', 'xterm.js'],
    repo: 'https://github.com/Suhas-123-cell/Terminal-control',
    featured: false,
    period: '2026',
  },
  {
    slug: 'purplle',
    sfx: 'BEEP!',
    domain: 'Computer vision',
    status: 'Shipped',
    title: 'Purplle Analytics',
    subtitle: 'Retail CCTV intelligence',
    description:
      'Customer analytics for retail stores from CCTV footage: foot traffic, zone heatmaps and dwell time. YOLOv8n with ByteTrack handles detection and tracking, FastAPI with SQLite serves the numbers, and a live dashboard shows them.',
    highlights: [
      'YOLOv8n + ByteTrack detection pipeline with visitor re-identification and re-entry detection',
      'Zone heatmaps show which parts of the floor hold attention, hour by hour',
      'FastAPI + SQLite API with a Docker Compose setup and a pytest suite',
    ],
    tags: ['Python', 'YOLOv8', 'FastAPI', 'SQLite', 'Computer Vision'],
    repo: 'https://github.com/Suhas-123-cell/purplle',
    image: '/images/purplle.png',
    featured: false,
    period: '2026',
  },
  {
    slug: 'venture-radar',
    sfx: 'PING!',
    domain: 'Multi-agent',
    status: 'Shipped',
    title: 'Venture Radar',
    subtitle: 'B2B opportunity scout',
    description:
      'Type a B2B industry and get back ranked AI automation opportunities with product briefs. A four-agent pipeline handles research, competitor scanning, opportunity scoring and brief writing, each agent feeding the next.',
    highlights: [
      'Four agents in sequence: research, competitor scan, opportunity scoring, brief writing',
      'Shared context state, so each agent builds on the last one instead of starting cold',
      'FastAPI endpoint with streaming progress feedback',
    ],
    tags: ['Python', 'Multi-Agent', 'LLM', 'FastAPI'],
    repo: 'https://github.com/Suhas-123-cell/Venture-Radar',
    image: '/images/venture-radar.png',
    featured: false,
    period: '2026',
  },
  {
    slug: 'ai-auction-room',
    sfx: 'SOLD!',
    domain: 'Real-time',
    status: 'Shipped',
    title: 'AI Auction Room',
    subtitle: 'Real-time fantasy auctions',
    description:
      'A real-time fantasy auction platform with virtual budgets. The server owns the timer, bids are handled atomically per room, and an AI auctioneer streams live commentary while an LLM council values each item.',
    highlights: [
      'Server-authoritative WebSocket timer with an asyncio lock per room for atomic bids',
      'Reconnect recovery rebuilds live state from the database',
      'Three-stage LLM council valuation and shill-bid detection',
    ],
    tags: ['Python', 'FastAPI', 'WebSockets', 'Supabase', 'React'],
    repo: 'https://github.com/Suhas-123-cell/ai-auction-room',
    featured: false,
    period: '2026',
  },
  {
    slug: 'rag-hotel',
    sfx: 'KNOCK!',
    domain: 'RAG',
    status: 'Live',
    title: 'StayChat',
    subtitle: 'Hotel RAG chatbot',
    description:
      'A hotel Q&A assistant that answers guest questions only from a curated knowledge base, using hybrid retrieval (FAISS vectors plus BM25 keywords) and Groq-hosted Llama. Live on Hugging Face Spaces.',
    highlights: [
      'Hybrid retrieval: FAISS vector search plus BM25 keyword matching, re-ranked together',
      'Strict grounding: the model only answers from the knowledge base',
      'Deployed publicly on Hugging Face Spaces',
    ],
    tags: ['Python', 'FAISS', 'BM25', 'Groq', 'RAG'],
    repo: 'https://github.com/Suhas-123-cell/RAG-hotel',
    demo: 'https://huggingface.co/spaces/suhas20sh/staychat-rag',
    image: '/images/staychat.png',
    featured: false,
    period: '2026',
  },
  {
    slug: 'streakfight',
    sfx: 'SNAP!',
    domain: 'Mobile',
    status: 'Shipped',
    title: 'StreakFight',
    subtitle: 'Group habit tracker',
    description:
      'Compete with friends on daily habit streaks. Miss a day and the chain breaks in front of the whole group. React Native app with a FastAPI backend, Supabase realtime and Gemini for weekly coaching.',
    highlights: [
      'Live group board through Supabase realtime subscriptions, no polling',
      'Gemini reads habit patterns and writes weekly coaching notes',
      'Cron-based missed-day detection flags a break before anyone opens the app',
    ],
    tags: ['React Native', 'FastAPI', 'Supabase', 'Gemini'],
    repo: 'https://github.com/Suhas-123-cell/streak',
    image: '/images/streak.png',
    featured: false,
    period: '2026',
  },
  {
    slug: 'anigo',
    sfx: 'GOTCHA!',
    domain: 'AR game',
    status: 'Shipped',
    title: 'AniGo',
    subtitle: 'AR anime collector',
    description:
      'A location-based AR game: walk around the real world to find and catch anime characters. React Native and Expo on the client, Node.js and Supabase behind it.',
    highlights: [
      'GPS spawn system places characters at real-world coordinates',
      'AR overlay built on the Expo Camera API, no third-party AR SDK',
      'Supabase for profiles, collections and a global leaderboard',
    ],
    tags: ['React Native', 'Expo', 'Node.js', 'Supabase', 'TypeScript'],
    repo: 'https://github.com/Suhas-123-cell/anigo',
    image: '/images/anigo.png',
    featured: false,
    period: '2026',
  },
]
