import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
  inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoundService } from './services/sound.service';
import { ChatAgentComponent } from './components/chat-agent.component';
import {
  PORTFOLIO_HERO_DATA,
  PROJECTS_DATA,
  UPCOMING_PROJECTS_DATA,
  EXPERIENCE_DATA,
  SKILL_GROUPS,
  CERTIFICATIONS_DATA,
  ACHIEVEMENTS_DATA,
  ProjectItem,
  UpcomingProjectItem,
  PersonaHeroData
} from './models/portfolio.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatAgentComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  readonly sound = inject(SoundService);
  private scrollRevealObserver: IntersectionObserver | null = null;

  // Core reactive signals - Full-Stack is PRIMARY; Strict Dark Mode
  readonly theme = signal<'dark'>('dark');
  readonly darkTheme = signal<'orange' | 'cyan' | 'emerald' | 'purple'>('orange');
  readonly persona = signal<'analytics' | 'fullstack'>('fullstack');
  readonly curtainVisible = signal<boolean>(true);
  readonly curtainOpening = signal<boolean>(false);
  readonly menuOpen = signal<boolean>(false);
  readonly copiedToast = signal<string | null>(null);
  readonly activeModalProject = signal<ProjectItem | null>(null);
  readonly activeUpcomingProject = signal<UpcomingProjectItem | null>(null);
  readonly activeResumeModal = signal<boolean>(false);
  readonly currentTime = signal<string>('');
  readonly selectedSkillCategory = signal<string>('All');

  // Hero Data
  readonly heroData = computed<PersonaHeroData>(() => PORTFOLIO_HERO_DATA[this.persona()]);
  readonly projects = PROJECTS_DATA;
  readonly upcomingProjects = UPCOMING_PROJECTS_DATA;
  readonly experiences = EXPERIENCE_DATA;
  readonly skillGroups = SKILL_GROUPS;
  readonly certifications = CERTIFICATIONS_DATA;
  readonly achievements = ACHIEVEMENTS_DATA;

  // Projects showcase
  readonly filteredProjects = computed(() => this.projects);

  // WorkLoader Interactive simulation state (Angular 22 + Node.js Express + MongoDB + Redis)
  readonly workloaderTaskInput = signal<string>(
    'Configured Redis task queues, automated Slack webhooks, and REST endpoints in Angular 22 and Node.js for zero-friction manager reporting.'
  );
  readonly workloaderPriority = signal<'Normal' | 'Urgent' | 'Blocker'>('Urgent');
  readonly workloaderManagerEmail = signal<string>('lead-eng@tetranetics.internal');
  readonly workloaderStatusReport = computed(() => {
    const task = this.workloaderTaskInput();
    const prio = this.workloaderPriority();
    const recipient = this.workloaderManagerEmail();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const etaStr = new Date(now.getTime() + 4 * 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return {
      recipient,
      subject: `[WorkLoader Sync - ${prio}] Sprint Deliverable Pulse: ${task.slice(0, 48)}...`,
      body: `Hi Team Lead,\n\nAutomatic WorkLoader telemetry update from Sunny Verma:\n\n• Deliverable: ${task}\n• Architecture: Angular 22 (Signals) + Node.js / Express + Redis Queue\n• Priority Level: ${prio}\n• Status: Active Development / Tests Running\n• Estimated Completion: Today @ ${etaStr}\n• Reminder Interval: Hourly cron trigger scheduled\n• Blocker Alert: None currently detected.\n\nAutomated by WorkLoader v0.8 Task Engine (Angular 22 & Node.js) at ${timeStr}.`,
      generatedAt: timeStr,
      eta: etaStr
    };
  });

  // Animated KPI Counters
  readonly counters = signal<number[]>([0, 0, 0, 0]);

  // 3D Telemetry card tilt style
  readonly telemetryTilt = signal<string>('rotateX(0deg) rotateY(0deg)');
  readonly telemetryGlare = signal<string>('transparent');

  // Interactive Food For Needy (Donation-to-Kitchen Community Prep Simulator)
  readonly foodDonationAmount = signal<number>(500);
  readonly selectedKitchenHub = signal<string>('Kitchen #04 - Central City Hub');
  readonly foodDispatchSimulated = signal<boolean>(false);
  readonly simulatedReceiptId = signal<string>('FFN-8842-K04');

  readonly simulatedCheckpoint = computed(() => {
    switch (this.selectedKitchenHub()) {
      case 'Kitchen #07 - Downtown Metro':
        return 'Hub 07: Downtown Shelter Point (28.6289° N, 77.2065° E)';
      case 'Kitchen #12 - Industrial Suburb':
        return 'Hub 12: Railway Colony Checkpoint (28.6502° N, 77.2210° E)';
      default:
        return 'Hub 04: Central Station Distribution Checkpoint (28.6139° N, 77.2090° E)';
    }
  });

  readonly calculatedFoodMeals = computed(() => {
    return Math.max(1, Math.floor(this.foodDonationAmount() / 30));
  });

  readonly calculatedRiceKg = computed(() => {
    return (this.calculatedFoodMeals() * 0.22).toFixed(1);
  });

  readonly calculatedDalKg = computed(() => {
    return (this.calculatedFoodMeals() * 0.12).toFixed(1);
  });

  readonly calculatedVeggiesKg = computed(() => {
    return (this.calculatedFoodMeals() * 0.18).toFixed(1);
  });

  // Interactive Live Spam Classifier simulation state
  readonly testEmailText = signal<string>(
    'Urgent alert: Congratulations! You have won a $1,000 cash prize voucher. Click here to verify your account right now.'
  );

  readonly spamPrediction = computed(() => {
    const text = this.testEmailText().toLowerCase();
    const spamWords = ['urgent', 'congratulations', 'won', 'free', 'cash', 'prize', 'voucher', 'click here', 'verify', 'winner', 'claim', 'money', 'selected', 'limited time'];
    let hits = 0;
    const matchedTokens: string[] = [];
    spamWords.forEach(w => {
      if (text.includes(w)) {
        hits++;
        matchedTokens.push(w);
      }
    });

    const exclamationCount = (text.match(/!/g) || []).length;
    const spamScore = Math.min(Math.max(hits * 18 + exclamationCount * 8 + (text.length > 20 ? 10 : 0), 6), 99);
    const isSpam = spamScore >= 50;

    return {
      score: spamScore,
      isSpam,
      label: isSpam ? 'SPAM DETECTED' : 'HAM / LEGITIMATE',
      confidence: `${spamScore}%`,
      matchedTokens
    };
  });

  // Spotify interactive simulator
  readonly spotifyTempo = signal<number>(128);
  readonly spotifyEnergy = signal<number>(75);
  readonly spotifyValence = signal<number>(68);

  readonly spotifyPopularityScore = computed(() => {
    const t = this.spotifyTempo();
    const e = this.spotifyEnergy();
    const v = this.spotifyValence();
    // Empirical EDA correlation formula from top 100 tracks
    const score = Math.round(40 + (t / 180) * 20 + (e / 100) * 25 + (v / 100) * 15);
    return Math.min(Math.max(score, 10), 99);
  });

  // Leaf Disease CNN simulator
  readonly leafSpecimen = signal<'blight' | 'healthy' | 'mold'>('blight');

  // Scroll-responsive background UI signals
  readonly scrollY = signal<number>(0);
  readonly scrollProgress = signal<number>(0);
  readonly activeSection = signal<'top' | 'about' | 'experience' | 'work' | 'skills' | 'contact'>('top');

  // Computed scroll-driven transforms
  readonly orb1Transform = computed(() => {
    const p = this.scrollProgress();
    const x = (p * 0.9) - 10;
    const y = (p * 0.6) - 5;
    const scale = 1 + (p / 100) * 0.4;
    return `translate3d(${x.toFixed(1)}vw, ${y.toFixed(1)}vh, 0) scale(${scale.toFixed(2)})`;
  });

  readonly orb2Transform = computed(() => {
    const p = this.scrollProgress();
    const x = -(p * 0.8) + 10;
    const y = -(p * 0.5) + 15;
    const scale = 1.15 - (p / 100) * 0.25;
    return `translate3d(${x.toFixed(1)}vw, ${y.toFixed(1)}vh, 0) scale(${scale.toFixed(2)})`;
  });

  readonly marquee1Transform = computed(() => `translate3d(${(-this.scrollY() * 0.45).toFixed(1)}px, 0, 0)`);
  readonly marquee2Transform = computed(() => `translate3d(${(this.scrollY() * 0.45 - 800).toFixed(1)}px, 0, 0)`);
  readonly gridTransform = computed(() => `translate3d(0, ${(-(this.scrollY() * 0.15) % 64).toFixed(1)}px, 0)`);
  readonly circuitTransform = computed(() => `translate3d(0, ${(-(this.scrollY() * 0.18) % 800).toFixed(1)}px, 0)`);

  readonly orb1Color = computed(() => {
    const isDark = this.theme() === 'dark';
    switch (this.activeSection()) {
      case 'top':
        return isDark ? 'radial-gradient(circle, rgba(255, 59, 0, 0.28) 0%, rgba(245, 158, 11, 0.12) 60%, transparent 80%)' : 'radial-gradient(circle, rgba(255, 59, 0, 0.12) 0%, rgba(245, 158, 11, 0.05) 60%, transparent 80%)';
      case 'about':
        return isDark ? 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.10) 60%, transparent 80%)' : 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.04) 60%, transparent 80%)';
      case 'experience':
        return isDark ? 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(13, 148, 136, 0.12) 60%, transparent 80%)' : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(13, 148, 136, 0.04) 60%, transparent 80%)';
      case 'work':
        return isDark ? 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(236, 72, 153, 0.14) 60%, transparent 80%)' : 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.05) 60%, transparent 80%)';
      case 'skills':
        return isDark ? 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(16, 185, 129, 0.12) 60%, transparent 80%)' : 'radial-gradient(circle, rgba(14, 165, 233, 0.10) 0%, rgba(16, 185, 129, 0.04) 60%, transparent 80%)';
      case 'contact':
        return isDark ? 'radial-gradient(circle, rgba(255, 59, 0, 0.32) 0%, rgba(236, 72, 153, 0.15) 60%, transparent 80%)' : 'radial-gradient(circle, rgba(255, 59, 0, 0.15) 0%, rgba(236, 72, 153, 0.06) 60%, transparent 80%)';
      default:
        return 'transparent';
    }
  });

  readonly orb2Color = computed(() => {
    const isDark = this.theme() === 'dark';
    switch (this.activeSection()) {
      case 'top':
        return isDark ? 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)';
      case 'about':
        return isDark ? 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)';
      case 'experience':
        return isDark ? 'radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)';
      case 'work':
        return isDark ? 'radial-gradient(circle, rgba(255, 59, 0, 0.24) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255, 59, 0, 0.09) 0%, transparent 70%)';
      case 'skills':
        return isDark ? 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)';
      case 'contact':
        return isDark ? 'radial-gradient(circle, rgba(245, 158, 11, 0.26) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(245, 158, 11, 0.10) 0%, transparent 70%)';
      default:
        return 'transparent';
    }
  });

  private timeInterval: ReturnType<typeof setInterval> | null = null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;
  private scrollTicking = false;

  private onScroll = () => {
    if (!this.scrollTicking) {
      window.requestAnimationFrame(() => {
        this.updateScrollState();
        this.scrollTicking = false;
      });
      this.scrollTicking = true;
    }
  };

  private updateScrollState() {
    if (typeof window === 'undefined') return;
    const currentY = window.scrollY || window.pageYOffset;
    this.scrollY.set(currentY);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max((currentY / docHeight) * 100, 0), 100) : 0;
    this.scrollProgress.set(progress);

    // Detect active section based on scroll offset
    const sections: ('top' | 'about' | 'experience' | 'work' | 'skills' | 'contact')[] = [
      'contact',
      'skills',
      'work',
      'experience',
      'about',
      'top'
    ];

    const viewportAnchor = window.innerHeight * 0.45;
    for (const sec of sections) {
      const el = document.getElementById(sec);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportAnchor) {
          if (this.activeSection() !== sec) {
            this.activeSection.set(sec);
          }
          break;
        }
      }
    }
  }

  ngOnInit() {
    this.initTheme();
    this.updateClock();
    this.timeInterval = setInterval(() => this.updateClock(), 1000);

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.updateScrollState();
    }

    // Auto trigger curtain opening after initial mount
    setTimeout(() => {
      this.openCurtain();
    }, 900);
  }

  ngAfterViewInit() {
    this.setupScrollReveal();
  }

  setupScrollReveal() {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-bottom, .scroll-reveal-scale'
      ).forEach(el => el.classList.add('is-revealed'));
      return;
    }

    this.scrollRevealObserver?.disconnect();

    this.scrollRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            this.scrollRevealObserver?.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05
      }
    );

    setTimeout(() => {
      const targets = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-bottom, .scroll-reveal-scale'
      );
      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        // If element is already in initial view, reveal it smoothly
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          this.scrollRevealObserver?.observe(el);
        }
      });
    }, 120);
  }

  ngOnDestroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.scrollRevealObserver?.disconnect();
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  private initTheme() {
    // Strictly Dark Mode
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');

    const savedDarkTheme = localStorage.getItem('sunny_dark_theme') as 'orange' | 'cyan' | 'emerald' | 'purple' | null;
    const initialTheme = savedDarkTheme && ['orange', 'cyan', 'emerald', 'purple'].includes(savedDarkTheme) ? savedDarkTheme : 'orange';
    this.darkTheme.set(initialTheme);
    document.documentElement.setAttribute('data-dark-theme', initialTheme);
  }

  setDarkTheme(newTheme: 'orange' | 'cyan' | 'emerald' | 'purple') {
    if (this.darkTheme() === newTheme) return;
    this.sound.playClick();
    this.darkTheme.set(newTheme);
    document.documentElement.setAttribute('data-dark-theme', newTheme);
    localStorage.setItem('sunny_dark_theme', newTheme);
    this.sound.playModeSwitch();
  }

  cycleDarkTheme() {
    const themes: ('orange' | 'cyan' | 'emerald' | 'purple')[] = ['orange', 'cyan', 'emerald', 'purple'];
    const currentIndex = themes.indexOf(this.darkTheme());
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.setDarkTheme(nextTheme);
  }

  openCurtain() {
    this.sound.playPop();
    this.curtainOpening.set(true);
    setTimeout(() => {
      this.curtainVisible.set(false);
      this.animateCounters();
      this.setupScrollReveal();
    }, 850);
  }

  replayCurtain() {
    this.sound.playClick();
    this.curtainVisible.set(true);
    this.curtainOpening.set(false);
    setTimeout(() => {
      this.openCurtain();
    }, 600);
  }

  toggleMenu() {
    this.sound.playClick();
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    if (this.menuOpen()) {
      this.sound.playClick();
      this.menuOpen.set(false);
    }
  }

  setPersona(mode: 'analytics' | 'fullstack') {
    if (this.persona() === mode) return;
    this.sound.playModeSwitch();
    this.persona.set(mode);
    this.animateCounters();
  }

  animateCounters() {
    const kpis = this.heroData().kpis;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      const nextValues = kpis.map(k => {
        return Math.round(eased * k.target);
      });
      this.counters.set(nextValues);

      if (p < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }

  onTelemetryMouseMove(e: MouseEvent, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 11;
    const rotY = ((x - centerX) / centerX) * 11;

    this.telemetryTilt.set(`rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`);
    this.telemetryGlare.set(
      `radial-gradient(circle at ${((x / rect.width) * 100).toFixed(1)}% ${((y / rect.height) * 100).toFixed(1)}%, rgba(255,255,255,0.18), transparent 60%)`
    );
  }


  resetTelemetryMove() {
    this.telemetryTilt.set('rotateX(0deg) rotateY(0deg)');
    this.telemetryGlare.set('transparent');
  }

  openProjectModal(proj: ProjectItem) {
    this.sound.playClick();
    this.activeModalProject.set(proj);
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal() {
    this.sound.playClick();
    this.activeModalProject.set(null);
    document.body.style.overflow = 'auto';
  }

  openUpcomingModal(proj: UpcomingProjectItem) {
    this.sound.playClick();
    this.activeUpcomingProject.set(proj);
    document.body.style.overflow = 'hidden';
  }

  closeUpcomingModal() {
    this.sound.playClick();
    this.activeUpcomingProject.set(null);
    document.body.style.overflow = 'auto';
  }

  openResumeModal() {
    this.sound.playClick();
    this.activeResumeModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeResumeModal() {
    this.sound.playClick();
    this.activeResumeModal.set(false);
    document.body.style.overflow = 'auto';
  }

  printResume() {
    this.sound.playClick();
    if (typeof window !== 'undefined') {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'visible';
      document.documentElement.style.overflow = 'visible';
      document.body.classList.add('is-printing-resume');

      // Allow style recalculation before browser opens native print preview
      setTimeout(() => {
        window.print();
        document.body.style.overflow = prevBodyOverflow || 'hidden';
        document.documentElement.style.overflow = prevHtmlOverflow || 'visible';
        document.body.classList.remove('is-printing-resume');
      }, 60);
    }
  }

  downloadResumeFile() {
    this.sound.playSuccess();
    this.copiedToast.set('Downloading Sunny Verma Resume (PDF)...');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.copiedToast.set(null);
    }, 3200);

    const link = document.createElement('a');
    link.href = 'assets/Sunny_Verma_Resume_Updated.pdf';
    link.download = 'Sunny_Verma_Resume_Updated.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  testSendWorkloaderUpdate() {
    this.sound.playSuccess();
    this.copiedToast.set('WorkLoader Engine: Executive manager update generated and simulated notification dispatched!');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.copiedToast.set(null);
    }, 3800);
  }

  copyEmail(customEmail?: string) {
    const emailToCopy = customEmail || 'sunverma192@gmail.com';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        this.sound.playSuccess();
        this.copiedToast.set(`Copied ${emailToCopy} to clipboard!`);
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
          this.copiedToast.set(null);
        }, 3200);
      });
    }
  }

  setSampleEmail(type: 'spam' | 'ham') {
    this.sound.playClick();
    if (type === 'spam') {
      this.testEmailText.set('URGENT: Claim your $5,000 cash voucher immediately! Click here to win big before limited time offer ends!');
    } else {
      this.testEmailText.set('Hi Sunny, regarding the Q3 Power BI dashboard update, we reviewed your DAX measures and the reporting latency is down 40%. Great work!');
    }
  }

  setFoodDonation(amount: number) {
    this.sound.playClick();
    this.foodDonationAmount.set(amount);
    this.foodDispatchSimulated.set(false);
  }

  setKitchenHub(hub: string) {
    this.sound.playClick();
    this.selectedKitchenHub.set(hub);
    this.foodDispatchSimulated.set(false);
  }

  simulateFoodDispatch() {
    this.sound.playSuccess();
    const hubSuffix = this.selectedKitchenHub().includes('#07') ? 'K07' : this.selectedKitchenHub().includes('#12') ? 'K12' : 'K04';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    this.simulatedReceiptId.set(`FFN-${randCode}-${hubSuffix}`);
    this.foodDispatchSimulated.set(true);
    this.copiedToast.set(`Dispatched ${this.calculatedFoodMeals()} freshly cooked hot meals to ${this.simulatedCheckpoint()}!`);
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.copiedToast.set(null);
    }, 4000);
  }

  resetFoodDispatch() {
    this.sound.playClick();
    this.foodDispatchSimulated.set(false);
  }

  private updateClock() {
    const now = new Date();
    // India Standard Time (IST)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    this.currentTime.set(new Intl.DateTimeFormat('en-US', options).format(now));
  }
}
