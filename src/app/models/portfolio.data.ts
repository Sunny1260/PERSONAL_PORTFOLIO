export interface KPIItem {
  label: string;
  target: number;
  unit: string;
  sub: string;
  sparkColor: string;
  sparkPoints: string;
}

export interface PersonaHeroData {
  eyebrow: string;
  titleMain: string;
  titleItalic: string;
  lead: string;
  dashTitle: string;
  dashStatus: string;
  dashFooterLeft: string;
  dashFooterRight: string;
  kpis: KPIItem[];
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  domain: 'analytics' | 'fullstack' | 'both';
  metric: string;
  metricLabel: string;
  description: string;
  tags: string[];
  image: string;
  palette: string[];
  simulationType: 'food_for_needy' | 'spam_classifier' | 'spotify_explorer' | 'leaf_diagnosis';
}

export interface ExperienceItem {
  index: string;
  role: string;
  org: string;
  location: string;
  date: string;
  domain: 'analytics' | 'fullstack' | 'both';
  badge: string;
  isCurrent?: boolean;
  metric?: string;
  bullets: string[];
}

export interface UpcomingProjectItem {
  id: string;
  index: string;
  title: string;
  badge: string;
  status: 'In Active Development' | 'Alpha Prototype' | 'Roadmap';
  completion: number;
  summary: string;
  architecture: string[];
  features: string[];
  targetRelease: string;
  accentColor: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  skillsGained: string[];
}

export const PORTFOLIO_HERO_DATA: Record<'analytics' | 'fullstack', PersonaHeroData> = {
  analytics: {
    eyebrow: 'Full-Stack Software Developer (MEAN & MERN) · Tetranetics, Mumbai',
    titleMain: 'Sunny Verma engineers full-stack systems ',
    titleItalic: 'with modern MEAN and MERN architectures.',
    lead: 'Software Developer at Tetranetics, Mumbai (Aug 2026 – Present). Specializing in modern web application engineering across MEAN (MongoDB, Express, Angular, Node.js) and MERN (MongoDB, Express, React, Node.js) stacks, robust REST APIs, PostgreSQL, and scalable microservices.',
    dashTitle: 'sunny_dev — production_cluster.env',
    dashStatus: 'systems operational · node v22',
    dashFooterLeft: 'stack: angular 22 · node.js · express · mongodb · react',
    dashFooterRight: 'current: Tetranetics, Mumbai · CGPA 8.0',
    kpis: [
      {
        label: 'MEAN & MERN Dev',
        target: 500,
        unit: 'hrs+',
        sub: 'Angular · React · Node · Express',
        sparkColor: '#ff3b00',
        sparkPoints: '0,20 20,17 40,15 60,11 80,7 100,4'
      },
      {
        label: 'Production APIs & Microservices',
        target: 18,
        unit: '+',
        sub: 'Node.js · Express · REST · JWT',
        sparkColor: '#06b6d4',
        sparkPoints: '0,18 20,14 40,15 60,9 80,10 100,4'
      },
      {
        label: 'Database Reliability',
        target: 99.8,
        unit: '%',
        sub: 'MongoDB & Mongoose · PostgreSQL',
        sparkColor: '#10b981',
        sparkPoints: '0,4 20,7 40,6 60,10 80,8 100,12'
      },
      {
        label: 'Academic Standing',
        target: 8.0,
        unit: '/10',
        sub: 'B.Tech in Computer Science · CDLU',
        sparkColor: '#a855f7',
        sparkPoints: '0,20 20,15 40,15 60,10 80,8 100,3'
      }
    ]
  },
  fullstack: {
    eyebrow: 'Full-Stack Software Developer (MEAN & MERN) · Tetranetics, Mumbai',
    titleMain: 'Sunny Verma engineers full-stack systems ',
    titleItalic: 'with modern MEAN and MERN architectures.',
    lead: 'Software Developer at Tetranetics, Mumbai (Aug 2026 – Present). Specializing in modern web application engineering across MEAN (MongoDB, Express, Angular, Node.js) and MERN (MongoDB, Express, React, Node.js) stacks, robust REST APIs, PostgreSQL, and scalable microservices.',
    dashTitle: 'sunny_dev — production_cluster.env',
    dashStatus: 'systems operational · node v22',
    dashFooterLeft: 'stack: angular 22 · node.js · express · mongodb · react',
    dashFooterRight: 'current: Tetranetics, Mumbai · CGPA 8.0',
    kpis: [
      {
        label: 'MEAN & MERN Dev',
        target: 500,
        unit: 'hrs+',
        sub: 'Angular · React · Node · Express',
        sparkColor: '#ff3b00',
        sparkPoints: '0,20 20,17 40,15 60,11 80,7 100,4'
      },
      {
        label: 'Production APIs & Microservices',
        target: 18,
        unit: '+',
        sub: 'Node.js · Express · REST · JWT',
        sparkColor: '#06b6d4',
        sparkPoints: '0,18 20,14 40,15 60,9 80,10 100,4'
      },
      {
        label: 'Database Reliability',
        target: 99.8,
        unit: '%',
        sub: 'MongoDB & Mongoose · PostgreSQL',
        sparkColor: '#10b981',
        sparkPoints: '0,4 20,7 40,6 60,10 80,8 100,12'
      },
      {
        label: 'Academic Standing',
        target: 8.0,
        unit: '/10',
        sub: 'B.Tech in Computer Science · CDLU',
        sparkColor: '#a855f7',
        sparkPoints: '0,20 20,15 40,15 60,10 80,8 100,3'
      }
    ]
  }
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'food-for-needy',
    index: '01 / 04',
    title: 'Food For Needy',
    category: 'Full-Stack MEAN & Social Impact',
    domain: 'fullstack',
    metric: '12,850+',
    metricLabel: 'hot meals prepared & served',
    description: 'High-throughput platform connecting donors directly with dedicated community kitchens. Monetary donations fund fresh, hygienic batch cooking on-site, dynamically dispatched to geofenced distribution hubs for needy families with transparent digital receipts.',
    tags: ['MEAN Stack', 'Angular 22', 'Node.js', 'Express', 'MongoDB', 'Redis Queues', 'Geofencing'],
    image: 'assets/projects/food-for-needy.jpg',
    palette: ['#ff3b00', '#10b981', '#f59e0b'],
    simulationType: 'food_for_needy'
  },
  {
    id: 'spam-detector',
    index: '02 / 04',
    title: 'Email Spam Detection',
    category: 'Machine Learning',
    domain: 'fullstack',
    metric: '95%+',
    metricLabel: 'test-set accuracy',
    description: 'Naive Bayes / SVM classifier with NLP preprocessing — tokenization, stopword removal, TF-IDF — deployed with a real-time interface for live email classification.',
    tags: ['Python', 'NLP', 'Scikit-learn', 'TF-IDF', 'SVM'],
    image: 'assets/projects/spam-detector.jpg',
    palette: ['#10b981', '#34d399', '#064e3b'],
    simulationType: 'spam_classifier'
  },
  {
    id: 'spotify-eda',
    index: '03 / 04',
    title: 'Spotify Top 100 Songs',
    category: 'Audio Data Engineering',
    domain: 'fullstack',
    metric: '3',
    metricLabel: 'audio features correlated',
    description: "Algorithmic analysis on Spotify's Top 100 dataset — tempo, energy and valence checked against popularity, visualized as heatmaps, scatter plots and bar charts to surface genre trends.",
    tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'EDA'],
    image: 'assets/projects/spotify-eda.jpg',
    palette: ['#f59e0b', '#fbbf24', '#78350f'],
    simulationType: 'spotify_explorer'
  },
  {
    id: 'plant-disease',
    index: '04 / 04',
    title: 'Plant Disease Detection',
    category: 'Deep Learning & Web App',
    domain: 'fullstack',
    metric: 'Live',
    metricLabel: 'image-upload diagnosis',
    description: 'Django web app wrapping a trained CNN that classifies plant diseases from leaf images, with a farmer-friendly UI for early crop treatment decisions.',
    tags: ['Python', 'Django', 'CNN', 'PyTorch', 'Vision'],
    image: 'assets/projects/plant-disease.jpg',
    palette: ['#06b6d4', '#38bdf8', '#083344'],
    simulationType: 'leaf_diagnosis'
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    index: '01',
    role: 'Full-Stack Software Developer (MEAN & MERN)',
    org: 'Tetranetics',
    location: 'Mumbai, India',
    date: 'Aug 2026 – Present',
    domain: 'fullstack',
    badge: 'Current Role',
    isCurrent: true,
    bullets: [
      'Architecting and deploying production full-stack web applications and microservices using Angular 22, React, Node.js, Express, and MongoDB.',
      'Engineering high-throughput RESTful APIs, JWT authentication, and automated background jobs with Redis and message queues.',
      'Designing scalable database schemas across MongoDB (Mongoose) and PostgreSQL, optimizing query latency and system throughput.'
    ]
  },
  {
    index: '02',
    role: 'Software Developer Intern',
    org: 'Inospire Software',
    location: 'Gurgaon, India',
    date: 'May 2025 – Sep 2025',
    domain: 'fullstack',
    badge: 'Software Eng',
    bullets: [
      'Developed frontend interactive modules and real-time dashboard components integrating with backend REST APIs.',
      'Optimized backend query execution and database schemas, reducing data retrieval and report generation latency by 40%.',
      'Collaborated with the core engineering team on unit testing, API contract validation, and responsive UI performance tuning.'
    ]
  },
  {
    index: '03',
    role: 'Software Engineering Intern',
    org: 'Akash Network Logistics',
    location: 'Rudrapur, India',
    date: 'Jul 2024 – Sep 2024',
    domain: 'fullstack',
    badge: 'Backend / Python',
    bullets: [
      'Engineered backend data ingestion scripts and workflow utilities using Python and SQL to automate logistics tracking.',
      'Built automated data processing pipelines and validation rules that cut manual report errors by 30% across freight workflows.',
      'Integrated internal operational APIs and database tables to surface real-time telemetry for daily dispatch operations.'
    ]
  },
  {
    index: '04',
    role: 'Full Stack Web Development Trainee',
    org: 'Ducat',
    location: 'Gurgaon, India',
    date: 'Mar 2025 – Sep 2025',
    domain: 'fullstack',
    badge: 'Full-Stack',
    metric: '200+ training hrs',
    bullets: [
      'Completed comprehensive full-stack engineering program covering modern frontend frameworks, Node.js, Express, and database design.',
      'Built and deployed end-to-end database-backed web applications with authentication, CRUD operations, and responsive UIs.'
    ]
  }
];

export const SKILL_GROUPS = [
  {
    title: 'MEAN & MERN Full-Stack Engineering',
    badge: 'Primary Domain',
    skills: ['Angular 22', 'Node.js', 'Express.js', 'MongoDB', 'ReactJS', 'TypeScript', 'JavaScript', 'Mongoose', 'RESTful APIs', 'HTML5 & CSS3']
  },
  {
    title: 'Backend, Database & Cloud',
    badge: 'Core Infrastructure',
    skills: ['PostgreSQL', 'Redis', 'SQL', 'SSMS', 'Django', 'Python', 'JWT & OAuth', 'Postman', 'Git & GitHub']
  },
  {
    title: 'Programming Languages',
    badge: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'C', 'C++', 'Java']
  },
  {
    title: 'Software Architecture & Tooling',
    badge: 'DevOps & Practices',
    skills: ['Microservices', 'Docker Basics', 'Linux/Bash', 'VS Code', 'Cursor IDE', 'Power BI', 'Agile/Scrum', 'CI/CD Basics']
  }
];

export const UPCOMING_PROJECTS_DATA: UpcomingProjectItem[] = [
  {
    id: 'workloader',
    index: 'LAB // 01',
    title: 'WorkLoader',
    badge: 'Automated Task Orchestrator',
    status: 'In Active Development',
    completion: 78,
    summary: 'An intelligent task reminder and manager synchronization platform designed to eliminate manual status reporting. Built with Angular 22 and Node.js/Express, it continuously tracks developer deliverables, sends contextual smart reminders across Slack and Email, monitors workload saturation, and automatically generates & dispatches structured progress summaries directly to managers without reporting friction.',
    architecture: ['Angular 22 (Signals & Standalone)', 'Node.js & Express.js', 'MongoDB & Mongoose', 'Redis Task Queue', 'PostgreSQL', 'RESTful APIs', 'Slack & Webhooks'],
    features: [
      'Automated Manager Pulse Dispatch (daily/weekly executive delivery digests)',
      'Smart Contextual Task Reminders (deadline risk calculation)',
      'Workload Saturation Engine (burnout prevention scoring)',
      'Multi-channel Dispatch via Webhooks (Slack, MS Teams, Email)'
    ],
    targetRelease: 'Q4 2026',
    accentColor: '#ff3b00'
  },
  {
    id: 'omni-assistant',
    index: 'LAB // 02',
    title: 'OmniAssistant AI',
    badge: 'Autonomous Executive Agent',
    status: 'Alpha Prototype',
    completion: 64,
    summary: 'A context-aware enterprise AI assistant and autonomous engineering copilot. Integrates localized vector search over internal documentation, orchestrates schedule reminders, drafts client correspondence, and executes semantic code-intelligence workflows with zero cloud data leaks.',
    architecture: ['TypeScript', 'Angular 22', 'Node.js', 'FastAPI', 'LangChain / RAG', 'ChromaDB', 'WebSockets'],
    features: [
      'Semantic Local Vector RAG (search codebases and design docs)',
      'Autonomous Task & Schedule Coordination',
      'Streaming WebSocket Response Pipelines (<120ms latency)',
      'Self-Hosted Privacy Fence for proprietary enterprise data'
    ],
    targetRelease: 'Q1 2027',
    accentColor: '#06b6d4'
  }
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    name: 'Power BI Job Simulation',
    issuer: 'PwC Switzerland · via Forage',
    date: 'Jan 2025',
    credentialId: 'xJ374c4sGr6W8pXj6',
    skillsGained: ['DAX Calculations', 'Executive KPI Dashboards', 'Data Modeling', 'Business Insight Delivery']
  },
  {
    name: 'Data Visualisation: Empowering Business with Effective Insights',
    issuer: 'Tata Group · via Forage',
    date: 'Jan 2025',
    credentialId: 'GGJLXywdExANEm9PB',
    skillsGained: ['Executive Storytelling', 'Visual Analytics', 'Stakeholder Framing', 'Time-series Forecasting']
  }
];

export const ACHIEVEMENTS_DATA: string[] = [
  'Certified in Robotics, Python Programming, and Cybersecurity fundamentals.',
  'Participant — MOE India IDE Bootcamp (Startup Ideation & Customer Psychology).',
  'Attendee — 5-Day Data Science Bootcamp at CDLU Sirsa (data wrangling, statistical modeling, ML workflows and visualization).'
];
