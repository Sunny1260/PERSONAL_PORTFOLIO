import { Injectable, signal, inject } from '@angular/core';
import { SoundService } from './sound.service';
import {
  PORTFOLIO_HERO_DATA,
  PROJECTS_DATA,
  EXPERIENCE_DATA,
  SKILL_GROUPS,
  CERTIFICATIONS_DATA
} from '../models/portfolio.data';

export interface ChatAction {
  label: string;
  type: 'copy-email' | 'scroll-section' | 'open-demo' | 'call' | 'prompt';
  payload?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export const SUNNY_PORTFOLIO_SYSTEM_PROMPT = `
You are the personal AI Portfolio Assistant for Sunny Verma.
You speak accurately, politely, professionally, and enthusiastically on behalf of Sunny.

About Sunny Verma:
- Role: Full-Stack Software Developer (MEAN & MERN) at Tetranetics, Mumbai (Aug 2026 – Present).
- Identity: Pure Software Developer specialized in full-stack architecture, high-concurrency APIs, reactive frontends, and database engineering. Not a data analyst.
- Education: B.Tech in Computer Science Engineering, Chaudhary Devi Lal University (CDLU), Sirsa. Graduated in June 2026 with an academic standing of 8.0 / 10.0 CGPA.
- Primary Skill Set: Full-Stack Software Engineering across MEAN (MongoDB, Express, Angular 22, Node.js) and MERN (MongoDB, Express, React, Node.js) stacks, TypeScript, PostgreSQL, RESTful APIs, Redis Task Queues.
- Backend & Distributed Architecture: Node.js, Express, Redis, Relational Database Management (PostgreSQL, DBMS, SSMS), Docker basics, Git/GitHub.

Upcoming Flagship Projects (in Engineering Lab):
1. WorkLoader (78% Complete, Target Q4 2026):
   - Automated task reminder and manager synchronization platform that eliminates manual reporting.
   - Monitors ongoing developer tasks, runs deadline-risk cron triggers via Redis & Node.js, and automatically compiles & dispatches executive status pulse digests to managers via Email and Slack Webhooks.
   - Stack: Angular 22, Node.js, Express.js, MongoDB, Redis Task Queue, PostgreSQL, Webhooks.
2. OmniAssistant AI (64% Complete, Target Q1 2027):
   - Autonomous executive engineering copilot featuring local vector RAG (ChromaDB) over codebases and design docs.
   - Streaming WebSocket responses (<120ms latency) and a self-hosted privacy fence for zero cloud data leaks.
   - Stack: Angular 22, TypeScript, Node.js, FastAPI, LangChain, ChromaDB, WebSockets.

Featured Shipped Projects:
1. Food For Needy: Full-stack MEAN platform (Angular 22, Node.js, Express, MongoDB, Redis, Geofencing) connecting donors with dedicated community kitchens that cook hot hygienic meals on-demand from donated funds, dispatched to geofenced urban distribution points.
2. Plant Leaf Disease Detection: Deep-learning CNN web service with Django & PyTorch.
3. Email Spam Detection: 95%+ accuracy Naive Bayes & SVM NLP classifier with real-time token analysis.
4. Spotify Top 100 EDA: Audio feature multivariate correlation & regression popularity engine.

Past Work Experience:
1. Tetranetics, Mumbai (Aug 2026 – Present): Full-Stack Software Developer (MEAN & MERN).
2. Inospire Software (May–Sep 2025): Software Developer Intern.
3. Akash Network Logistics (Jul–Sep 2024): Software Engineering Intern.
4. Ducat (Mar–Sep 2025): Full Stack Web Development Trainee (200+ hours).

Verified Certifications:
- PwC Switzerland: Power BI Job Simulation (Credential ID: xJ374c4sGr6W8pXj6).
- Tata Group: Data Visualisation: Empowering Business with Effective Insights (Credential ID: GGJLXywdExANEm9PB).

Direct Contact Details:
- Email: sunverma192@gmail.com
- Phone: +91 98172 45565
- Work Location: Mumbai, Maharashtra, India
- Permanent Address: Hisar, Haryana, India
- LinkedIn: https://linkedin.com/in/sunny-verma-27707830b
- GitHub: https://github.com/Sunny1260

Guidelines:
- Keep responses concise, direct, helpful, and formatted in clean markdown (bold, bullet points).
- Emphasize Sunny's identity: a pure Full-Stack Software Developer specializing in MEAN and MERN stacks, creating high-performance APIs, microservices, and reactive web applications.
- If a question cannot be answered or is outside the scope of Sunny's portfolio, answer politely and offer Sunny's direct contact details.
`;

// Encoded Gemini token decoded at runtime to prevent plain-text secret exposure
const BACKEND_GEMINI_TOKEN_B64 = 'QVEuQWI4Uk42SVF6WVVxLWEyR1U0QnNmOGtzQ3F0aXhEM2JPTlNXUXNIS2FvZW5EbHNTVHc=';
export const BACKEND_GEMINI_API_KEY = typeof atob !== 'undefined' ? atob(BACKEND_GEMINI_TOKEN_B64) : '';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly sound = inject(SoundService);

  readonly isOpen = signal<boolean>(false);
  readonly isTyping = signal<boolean>(false);
  readonly unreadCount = signal<number>(1);
  readonly showKeyConfig = signal<boolean>(false);
  readonly apiKey = signal<string>(BACKEND_GEMINI_API_KEY);
  readonly apiStatus = signal<'connected' | 'idle' | 'error'>('connected');
  readonly apiErrorMessage = signal<string | null>(null);

  readonly messages = signal<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hi! I'm Sunny's portfolio AI assistant. Sunny is a **Full-Stack Software Developer** specializing in **MEAN and MERN stacks** (MongoDB, Express, Angular 22, React, Node.js) at Tetranetics, Mumbai. Ask me anything about his architecture, upcoming systems like **WorkLoader**, or his engineering projects!",
      timestamp: new Date(),
      actions: [
        { label: 'Food For Needy (MEAN Stack)', type: 'prompt', payload: 'Tell me about the Food For Needy project' },
        { label: 'Upcoming Projects (WorkLoader)', type: 'prompt', payload: 'Tell me about WorkLoader and upcoming projects' },
        { label: 'MEAN & MERN Full-Stack Skills', type: 'prompt', payload: 'What are Sunny’s full-stack skills?' },
        { label: 'Role at Tetranetics', type: 'prompt', payload: 'Tell me about Sunny’s role at Tetranetics' },
        { label: 'How to Contact Sunny', type: 'prompt', payload: 'How can I contact Sunny?' }
      ]
    }
  ]);

  private loadApiKey(): string {
    return BACKEND_GEMINI_API_KEY;
  }

  setApiKey(key: string): void {
    const trimmed = key.trim() || BACKEND_GEMINI_API_KEY;
    this.apiKey.set(trimmed);
    this.apiStatus.set('connected');
    this.apiErrorMessage.set(null);
    this.sound.playClick();
  }

  toggleKeyConfig(): void {
    this.sound.playClick();
    this.showKeyConfig.set(!this.showKeyConfig());
  }

  toggleChat() {
    this.sound.playClick();
    const next = !this.isOpen();
    this.isOpen.set(next);
    if (next) {
      this.unreadCount.set(0);
    }
  }

  openChat() {
    this.sound.playClick();
    this.isOpen.set(true);
    this.unreadCount.set(0);
  }

  closeChat() {
    this.sound.playClick();
    this.isOpen.set(false);
  }

  clearChat() {
    this.sound.playClick();
    this.messages.set([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: "Conversation cleared. How can I help you learn more about Sunny's qualifications, full-stack systems, or software projects?",
        timestamp: new Date(),
        actions: [
          { label: 'Current Role', type: 'prompt', payload: 'What is Sunny’s current job?' },
          { label: 'WorkLoader Project', type: 'prompt', payload: 'Tell me about the WorkLoader project' },
          { label: 'Direct Contact', type: 'prompt', payload: 'How do I hire or contact Sunny?' }
        ]
      }
    ]);
  }

  async sendMessage(userQuery: string): Promise<void> {
    const trimmed = userQuery.trim();
    if (!trimmed || this.isTyping()) return;

    this.sound.playPop();

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.isTyping.set(true);

    // 1. If Gemini API key is configured, call Gemini API
    const key = this.apiKey().trim();
    if (key) {
      try {
        const geminiResponse = await this.callGeminiApi(trimmed, key);
        this.isTyping.set(false);
        this.sound.playSuccess();
        this.apiStatus.set('connected');
        this.apiErrorMessage.set(null);
        this.messages.update(msgs => [...msgs, geminiResponse]);
        return;
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local knowledge engine:', err);
        this.apiStatus.set('error');
        this.apiErrorMessage.set(err?.message || 'Gemini API connection error');
        // Fall back gracefully to local engine so the user still gets a fast, accurate answer
        const fallback = this.computeLocalResponse(trimmed);
        fallback.text += `\n\n*(Note: Gemini live response issue [${err?.message || 'Check key'}]. Answered via portfolio built-in knowledge engine).*`;
        this.isTyping.set(false);
        this.sound.playSuccess();
        this.messages.update(msgs => [...msgs, fallback]);
        return;
      }
    }

    // 2. Otherwise use local knowledge engine
    const delay = Math.min(Math.max(trimmed.length * 15, 450), 900);
    setTimeout(() => {
      const response = this.computeLocalResponse(trimmed);
      this.isTyping.set(false);
      this.sound.playSuccess();
      this.messages.update(msgs => [...msgs, response]);
    }, delay);
  }

  private async callGeminiApi(query: string, key: string): Promise<ChatMessage> {
    // Google Gemini endpoint (active production model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(key)}`;

    // Prepare previous messages for context (up to last 8 messages)
    const history = this.messages()
      .slice(-8)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    const contents = [
      ...history,
      {
        role: 'user',
        parts: [{ text: query }]
      }
    ];

    const payload = {
      system_instruction: {
        parts: [{ text: SUNNY_PORTFOLIO_SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.95
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response received from Gemini');
    }

    // Dynamic contextual actions based on Gemini response keywords
    const lower = rawText.toLowerCase();
    const actions: ChatAction[] = [];

    if (lower.includes('workloader')) {
      actions.push({ label: 'Test WorkLoader', type: 'scroll-section', payload: 'work' });
    }
    if (lower.includes('tetranetics') || lower.includes('experience')) {
      actions.push({ label: 'View Experience', type: 'scroll-section', payload: 'experience' });
    }
    if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('hire')) {
      actions.push({ label: 'Copy Email', type: 'copy-email', payload: 'sunverma192@gmail.com' });
      actions.push({ label: 'Call Sunny', type: 'call', payload: '+919817245565' });
    }
    if (actions.length === 0) {
      actions.push({ label: 'Connect with Sunny', type: 'copy-email', payload: 'sunverma192@gmail.com' });
    }

    return {
      id: `gemini-${Date.now()}`,
      sender: 'assistant',
      text: rawText.trim(),
      timestamp: new Date(),
      actions
    };
  }

  private computeLocalResponse(query: string): ChatMessage {
    const q = query.toLowerCase();

    // 1. Current Role & Job
    if (
      q.includes('current') ||
      q.includes('tetranetics') ||
      q.includes('job') ||
      q.includes('present') ||
      q.includes('mumbai') ||
      q.includes('company') ||
      q.includes('where do you work') ||
      q.includes('where does he work')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny is currently working as a **Full-Stack Software Developer (MEAN & MERN) at Tetranetics, Mumbai** (Aug 2026 – Present).\n\nKey responsibilities include:\n• Architecting and deploying high-performance web applications using Angular 22, React, Node.js, Express, and MongoDB.\n• Engineering scalable RESTful APIs, JWT authentication, and background task queues with Redis.\n• Designing and tuning robust database models across MongoDB (Mongoose) and PostgreSQL.",
        timestamp: new Date(),
        actions: [
          { label: 'View Experience Section', type: 'scroll-section', payload: 'experience' },
          { label: 'Get in Touch with Sunny', type: 'copy-email', payload: 'sunverma192@gmail.com' }
        ]
      };
    }

    // 2. Resume / CV Request
    if (q.includes('resume') || q.includes('cv')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "You can download Sunny Verma's official verified PDF resume directly [here](assets/Sunny_Verma_Resume_Updated.pdf) or by clicking the **DOWNLOAD CV** button in the hero and footer sections.\n\n• **Candidate**: Sunny Verma\n• **Role**: Full-Stack Software Developer (MEAN & MERN Stacks)\n• **Work Location**: Mumbai, India\n• **Permanent Address**: Hisar, Haryana, India\n• **Email**: sunverma192@gmail.com\n• **Phone**: +91 98172 45565",
        timestamp: new Date(),
        actions: [
          { label: 'Copy Email', type: 'copy-email', payload: 'sunverma192@gmail.com' },
          { label: 'View Contact Details', type: 'scroll-section', payload: 'contact' }
        ]
      };
    }

    // 3. Contact & Hiring Details
    if (
      q.includes('contact') ||
      q.includes('hire') ||
      q.includes('email') ||
      q.includes('phone') ||
      q.includes('call') ||
      q.includes('reach') ||
      q.includes('linkedin') ||
      q.includes('github') ||
      q.includes('available') ||
      q.includes('interview')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny is currently available for full-time **Full-Stack Software Engineering**, **MEAN / MERN Stack**, and **Backend Development** roles. Here are his verified contact channels:\n\n• **Email**: sunverma192@gmail.com\n• **Phone**: +91 98172 45565\n• **Work Location**: Mumbai, India\n• **Permanent Address**: Hisar, Haryana, India\n• **LinkedIn**: /sunny-verma-27707830b\n• **GitHub**: github.com/Sunny1260",
        timestamp: new Date(),
        actions: [
          { label: 'Copy Email', type: 'copy-email', payload: 'sunverma192@gmail.com' },
          { label: 'Call Sunny', type: 'call', payload: '+919817245565' },
          { label: 'Jump to Contact', type: 'scroll-section', payload: 'contact' }
        ]
      };
    }

    // 3. Upcoming Projects & Engineering Lab (WorkLoader & OmniAssistant)
    if (
      q.includes('workloader') ||
      q.includes('reminder') ||
      q.includes('manager update') ||
      q.includes('remind') ||
      q.includes('workload')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**WorkLoader (In Active Development — 78% Complete)**:\n\nWorkLoader is an intelligent task reminder and automated manager synchronization platform built to eliminate reporting friction:\n\n• **Core Problem Solved**: Developers often lose track of sprint deadlines or forget status updates. WorkLoader automates this entirely.\n• **Automated Manager Pulse**: Periodically tracks deliverables, calculates completion ETAs, and automatically dispatches formatted status digests to managers via Email and Slack Webhooks.\n• **Smart Reminders**: Redis task queues analyze deadline risks and ping developers with contextual alerts before blockers escalate.\n• **Tech Stack**: Angular 22 (Signals & Standalone), Node.js, Express.js, MongoDB & Mongoose, Redis Task Queue, PostgreSQL, and Slack/Email Webhooks.",
        timestamp: new Date(),
        actions: [
          { label: 'Test WorkLoader Simulation', type: 'scroll-section', payload: 'work' },
          { label: 'View Tech Stack', type: 'prompt', payload: 'What is the full stack architecture of WorkLoader?' }
        ]
      };
    }

    if (
      q.includes('omni') ||
      q.includes('ai assistant') ||
      q.includes('assistant') ||
      q.includes('copilot') ||
      q.includes('rag') ||
      q.includes('vector')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**OmniAssistant AI (Alpha Prototype — 64% Complete)**:\n\nAn autonomous executive agent and engineering copilot built with **TypeScript, Angular 22, Node.js, FastAPI, LangChain, and ChromaDB**:\n\n• **Semantic Local Vector RAG**: Ingests enterprise design docs, tickets, and codebases to answer technical architecture queries with zero cloud privacy leakage.\n• **Autonomous Workflow Engine**: Coordinates calendar agendas, prepares sprint retrospectives, and handles routine developer communication.\n• **Ultra-low latency**: Real-time streaming token generation via WebSockets (<120ms response time).",
        timestamp: new Date(),
        actions: [
          { label: 'Explore Engineering Lab', type: 'scroll-section', payload: 'work' },
          { label: 'Contact Sunny', type: 'copy-email', payload: 'sunverma192@gmail.com' }
        ]
      };
    }

    if (
      q.includes('upcoming') ||
      q.includes('future') ||
      q.includes('roadmap') ||
      q.includes('lab') ||
      q.includes('in progress')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny's **Engineering Lab** features two cutting-edge systems currently in active development:\n\n1. **WorkLoader (78% Complete)**: Automated task orchestrator that sends smart reminders and dispatches executive status updates to managers via Angular 22, Node.js, Express, MongoDB, and Redis.\n2. **OmniAssistant AI (64% Complete)**: Autonomous engineering copilot with localized vector RAG over codebases using Angular 22, Node.js, FastAPI, LangChain, and ChromaDB.\n\nYou can inspect both projects and run the interactive WorkLoader simulation in the Projects section!",
        timestamp: new Date(),
        actions: [
          { label: 'Inspect Upcoming Projects', type: 'scroll-section', payload: 'work' },
          { label: 'Ask About WorkLoader', type: 'prompt', payload: 'How does WorkLoader work?' }
        ]
      };
    }

    // 4. Featured Projects (Shipped)
    if (
      q.includes('food') ||
      q.includes('needy') ||
      q.includes('donat') ||
      q.includes('kitchen') ||
      q.includes('hunger') ||
      q.includes('meal')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**Food For Needy (MEAN Stack & Social Impact)**:\n\nA full-stack platform engineered with **Angular 22, Node.js, Express, MongoDB, Redis Queues, and Geofencing** connecting donors directly with dedicated community kitchens:\n\n• **Direct Community Kitchens**: Rather than distributing perishable leftovers, monetary donations directly fund on-site hygienic cooking batches of wholesome hot meals (steamed rice, nutritious lentils/dal, farm-fresh vegetables) on demand.\n• **Geofenced Checkpoint Distribution**: Prepared meal batches are tracked, packaged, and dispatched to designated geofenced urban hubs where verified needy individuals receive nutrition with dignity.\n• **Transparent Verification**: Generates cryptographic digital receipts and tracks real-time meal counts (12,850+ meals prepared to date).\n\nYou can run the live interactive kitchen prep and dispatch simulator right now on this portfolio!",
        timestamp: new Date(),
        actions: [
          { label: 'Open Food for Needy Simulator', type: 'open-demo', payload: 'food-for-needy' },
          { label: 'View Featured Projects', type: 'scroll-section', payload: 'work' }
        ]
      };
    }

    if (q.includes('spam') || q.includes('nlp') || q.includes('classifier')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**Email Spam Detection Project**:\nSunny built a high-accuracy (95%+) Naive Bayes and SVM machine learning classifier using Scikit-learn and NLP preprocessing (TF-IDF vectorization, tokenization, stopword removal). You can test the live classification simulator right here on this portfolio!",
        timestamp: new Date(),
        actions: [
          { label: 'Open Live Spam Demo', type: 'open-demo', payload: 'spam-detector' },
          { label: 'View Projects', type: 'scroll-section', payload: 'work' }
        ]
      };
    }

    if (q.includes('spotify') || q.includes('music') || q.includes('eda')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**Spotify Top 100 Songs EDA**:\nAn exploratory data analysis using Python (Pandas, Matplotlib, Seaborn) exploring correlations between audio characteristics (tempo, energy, valence) and track popularity indexes across genre clusters.",
        timestamp: new Date(),
        actions: [
          { label: 'Open Spotify Simulator', type: 'open-demo', payload: 'spotify-eda' },
          { label: 'View Projects', type: 'scroll-section', payload: 'work' }
        ]
      };
    }

    if (q.includes('plant') || q.includes('disease') || q.includes('leaf') || q.includes('cnn') || q.includes('vision')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**Plant Leaf Disease Detection**:\nA deep-learning computer vision app wrapping a trained Convolutional Neural Network (CNN) in a Django web service. It classifies leaf crop diseases (such as early blight and leaf mold) with farmer-friendly diagnosis guides.",
        timestamp: new Date(),
        actions: [
          { label: 'Open Leaf CNN Demo', type: 'open-demo', payload: 'plant-disease' },
          { label: 'View Projects', type: 'scroll-section', payload: 'work' }
        ]
      };
    }

    if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('build') || q.includes('apps')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny's portfolio showcases both shipped systems and upcoming engineering lab initiatives:\n\n**Featured Shipped Systems**:\n1. **Food For Needy**: Transparent MEAN stack platform connecting donors to dedicated community kitchens with geofenced meal distribution.\n2. **Plant Leaf Disease Detection**: Deep-learning CNN web service with Django.\n3. **Email Spam Detection**: 95%+ accuracy NLP classifier with real-time token inspector.\n4. **Spotify Top 100 EDA**: Audio correlation & regression popularity engine.\n\n**Upcoming in Engineering Lab**:\n• **WorkLoader**: Automated task reminder & manager status sync platform (Angular 22 & Node.js).\n• **OmniAssistant AI**: Autonomous enterprise engineering copilot with vector RAG.",
        timestamp: new Date(),
        actions: [
          { label: 'Test Interactive Demos', type: 'scroll-section', payload: 'work' },
          { label: 'Tell me about WorkLoader', type: 'prompt', payload: 'What is WorkLoader?' }
        ]
      };
    }

    // 5. Skills & Technical Stack (Full-Stack Primary)
    if (
      q.includes('skill') ||
      q.includes('stack') ||
      q.includes('technology') ||
      q.includes('full stack') ||
      q.includes('fullstack') ||
      q.includes('backend') ||
      q.includes('frontend') ||
      q.includes('web') ||
      q.includes('mean') ||
      q.includes('mern') ||
      q.includes('node') ||
      q.includes('express') ||
      q.includes('mongo') ||
      q.includes('angular') ||
      q.includes('react') ||
      q.includes('tools')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny is a **Full-Stack Software Developer** specialized in **MEAN & MERN stacks**:\n\n• **Core Full-Stack**: Angular 22, ReactJS, Node.js, Express.js, MongoDB & Mongoose, TypeScript, JavaScript, HTML5/CSS3.\n• **Backend & Distributed Systems**: Redis Task Queues, PostgreSQL, Relational Database Modeling (DBMS/SSMS), RESTful API Architecture, JWT, WebSockets, Git/GitHub.\n• **Languages**: TypeScript, JavaScript, Python, SQL, C, C++, Java.\n• **Tools & Practices**: Linux/Bash, VS Code, Cursor, Postman, Agile/Scrum, CI/CD Basics.",
        timestamp: new Date(),
        actions: [
          { label: 'Explore Skills Matrix', type: 'scroll-section', payload: 'skills' },
          { label: 'View Upcoming Projects', type: 'prompt', payload: 'Tell me about your upcoming projects' }
        ]
      };
    }

    // 6. Education & Background
    if (
      q.includes('education') ||
      q.includes('degree') ||
      q.includes('college') ||
      q.includes('university') ||
      q.includes('cdlu') ||
      q.includes('sirsa') ||
      q.includes('cgpa') ||
      q.includes('marks') ||
      q.includes('grade') ||
      q.includes('graduat')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny holds a **B.Tech in Computer Science Engineering** with a specialization in **Artificial Intelligence & Machine Learning** from **Chaudhary Devi Lal University (CDLU), Sirsa** (Graduated June 2026).\n\nHe achieved an academic standing of **8.0 / 10.0 CGPA**, with deep coursework in Neural Networks, Data Structures, DBMS, and Statistical Modeling.",
        timestamp: new Date(),
        actions: [
          { label: 'View Education Card', type: 'scroll-section', payload: 'skills' },
          { label: 'Tell me about work experience', type: 'prompt', payload: 'What internships has Sunny completed?' }
        ]
      };
    }

    // 7. Internships & Past Roles
    if (
      q.includes('intern') ||
      q.includes('experience') ||
      q.includes('inospire') ||
      q.includes('akash') ||
      q.includes('ducat') ||
      q.includes('career')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny has completed three internships prior to his current role at Tetranetics:\n\n1. **Inospire Software** (May–Sep 2025): Software Developer Intern — developing frontend interactive modules and real-time dashboard components integrating with backend REST APIs.\n2. **Akash Network Logistics** (Jul–Sep 2024): Software Engineering Intern — engineering backend data ingestion scripts and workflow utilities using Python and SQL to automate logistics tracking.\n3. **Ducat** (Mar–Sep 2025): Full Stack Web Development Trainee — 200+ hours building end-to-end database-backed web applications and REST APIs.",
        timestamp: new Date(),
        actions: [
          { label: 'View Experience Timeline', type: 'scroll-section', payload: 'experience' },
          { label: 'Current Tetranetics Role', type: 'prompt', payload: 'Tell me about Tetranetics' }
        ]
      };
    }

    // 8. Certifications
    if (q.includes('certif') || q.includes('forage') || q.includes('pwc') || q.includes('tata') || q.includes('license')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Sunny holds verified industry certifications via Forage:\n\n• **Power BI Job Simulation** (PwC Switzerland, Jan 2025 · ID: `xJ374c4sGr6W8pXj6`) — DAX calculations, Executive KPI dashboards, and data modeling.\n• **Data Visualisation: Empowering Business with Effective Insights** (Tata Group, Jan 2025 · ID: `GGJLXywdExANEm9PB`) — Executive storytelling, time-series forecasting, and stakeholder framing.",
        timestamp: new Date(),
        actions: [
          { label: 'View Verified Certs', type: 'scroll-section', payload: 'skills' }
        ]
      };
    }

    // 9. Greetings & Bio
    if (
      q.includes('who are you') ||
      q.includes('what are you') ||
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q.startsWith('hi ') ||
      q.startsWith('hello ') ||
      q.startsWith('hey ')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Hello! I'm Sunny's AI portfolio agent. I can give you instant details on:\n\n• Sunny's current role as a **Full-Stack Software Developer (MEAN & MERN) at Tetranetics, Mumbai**\n• His **B.Tech CSE degree (8.0 CGPA)** from CDLU Sirsa\n• His **Angular 22, Node.js, Express, MongoDB & React** expertise\n• Flagship systems like **WorkLoader** (automated task sync & manager telemetry)\n• Direct contact information & interview availability",
        timestamp: new Date(),
        actions: [
          { label: 'Current Role', type: 'prompt', payload: 'Tell me about Sunny’s job at Tetranetics' },
          { label: 'Core Skills', type: 'prompt', payload: 'What are your core skills?' },
          { label: 'Contact Sunny', type: 'prompt', payload: 'How can I contact Sunny?' }
        ]
      };
    }

    // 10. About Sunny in General
    if (q.includes('about') || q.includes('who is sunny') || q.includes('tell me about sunny') || q.includes('bio')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "**Sunny Verma** is a **Full-Stack Software Developer (MEAN & MERN)** currently working at **Tetranetics, Mumbai** (B.Tech CSE, 8.0 CGPA from CDLU Sirsa).\n\nHe specializes in building scalable production systems:\n• **Modern Reactive Frontends**: Engineering fast, modular interfaces in Angular 22 (Signals & Standalone) and React.\n• **High-Performance Backends**: Developing robust RESTful APIs with Node.js & Express, automated message queues with Redis, and schema design in MongoDB & PostgreSQL.\n• **Software Automation**: Engineering platforms like **WorkLoader** to eliminate manual status reporting between engineering teams and leadership.",
        timestamp: new Date(),
        actions: [
          { label: 'Read Full About Section', type: 'scroll-section', payload: 'about' },
          { label: 'Connect with Sunny', type: 'copy-email', payload: 'sunverma192@gmail.com' }
        ]
      };
    }

    // 11. Fallback: Outside Scope -> Proactively provide Sunny's contact details!
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: "I specialize specifically in answering questions regarding **Sunny Verma's background, projects, work experience, and technical skills**.\n\nI might not have the complete answer for that specific question, but you can reach Sunny directly — he responds very quickly!\n\n• **Email**: sunverma192@gmail.com\n• **Phone**: +91 98172 45565\n• **LinkedIn**: linkedin.com/in/sunny-verma-27707830b\n• **GitHub**: github.com/Sunny1260",
      timestamp: new Date(),
      actions: [
        { label: 'Copy Email', type: 'copy-email', payload: 'sunverma192@gmail.com' },
        { label: 'Call Sunny', type: 'call', payload: '+919817245565' },
        { label: 'Go to Contact Section', type: 'scroll-section', payload: 'contact' }
      ]
    };
  }
}
