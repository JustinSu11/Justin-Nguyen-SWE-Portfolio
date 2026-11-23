export type Project = {
  name: string;
  blurb: string;
  tags: string[];
  live?: string;
  source: string;
};

export const projects: Project[] = [
  {
    name: 'BeautyByAmy',
    blurb: 'Modern salon booking platform: real-time scheduling, service management, clean client experience.',
    tags: ['Next.js', 'TypeScript', 'Square', 'Drizzle ORM'],
    live: 'https://iibeautybyamyii.com',
    source: 'https://github.com/JustinSu11/BeautyByAmy',
  },
  {
    name: 'Charles',
    blurb: 'AI voice assistant: understands natural language, replies in real time, works with multiple LLM providers.',
    tags: ['Python', 'FastAPI', 'Whisper', 'Electron'],
    live: 'https://charles-swart-gamma.vercel.app',
    source: 'https://github.com/JustinSu11/charles',
  },
  {
    name: 'ClutchCall',
    blurb: 'Full-stack sports analytics app using AI/ML to surface top players and teams across NBA, NFL and soccer from real-time stats.',
    tags: ['Python', 'Flask', 'React', 'Next.js'],
    source: 'https://github.com/JustinSu11/clutch-call',
  },
];
