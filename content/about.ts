export const about = {
  name: 'Suhas Choudary',
  fullName: 'Maddali Suhas Choudary',
  role: 'AI engineer and full stack developer',
  location: 'Hyderabad, India',
  education: 'B.Tech CSE, IIIT Senapati, Manipur (2023-2027)',
  photo: '/images/suhas.jpg',
  resume: '/Suhas_Choudary_Resume.pdf',
  focus: ['Industrial AI', 'Agent security', 'LLM evaluation', 'Full stack'],
  tagline: 'I build AI systems end to end, and I report the numbers honestly: baselines, confounds and negative results included.',
  experience: {
    role: 'Research Intern',
    org: 'IIIT Dharwad, Dept. of CSE',
    period: 'Jun - Aug 2026',
    points: [
      'Built a curriculum question-generation system: FastAPI serving five LLMs (T5, GPT-2, LLaMA 3.2, Gemma, Phi-3) behind a React UI, with LoRA/PEFT fine-tuning on pairs mined from NCERT textbooks.',
      'Showed that reference-based metrics ranked the models in reverse order of real quality (one base model hit 0.96 ROUGE-L by copying a PDF footer), then designed a grounding metric that fixed the ranking.',
      'Fine-tuning lifted the grounded-question rate from 3.2% to 91.2% for GPT-2 and from 58.9% to 86.4% for Phi-3, across 1,400 generated questions.',
    ],
  },
  // Origin story, told as comic captions.
  origin: [
    {
      caption: 'The bite',
      text: 'It started with Python and a question: can a model check its own work? That became Hallu-Check, a pipeline that puts every claim an LLM makes on trial.',
    },
    {
      caption: 'The training',
      text: 'A research internship at IIIT Dharwad taught me to distrust easy metrics. ROUGE said the worst model was the best; I built a metric that told the truth.',
    },
    {
      caption: 'The responsibility',
      text: 'Agents can now run real tools, so I build the guardrails too. IntentShield blocks harmful tool calls before they happen, and the caveats sit next to the numbers.',
    },
  ],
  links: {
    github: 'https://github.com/Suhas-123-cell',
    email: 'suhaschowdary25@gmail.com',
  },
}
