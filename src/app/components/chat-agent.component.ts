import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  effect,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatAction, ChatMessage } from '../services/chat.service';
import { SoundService } from '../services/sound.service';
import { PROJECTS_DATA, ProjectItem } from '../models/portfolio.data';

@Component({
  selector: 'app-chat-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ==================== FLOATING MOVEABLE & REMOVEABLE BOT WIDGET ==================== -->
    @if (!isDismissed() && !chatService.isOpen()) {
      <div
        #draggableWidget
        class="fixed z-40 select-none will-change-transform"
        [style.left.px]="position().x >= 0 ? position().x : null"
        [style.top.px]="position().y >= 0 ? position().y : null"
        [style.bottom]="position().x < 0 ? '24px' : null"
        [style.right]="position().x < 0 ? '24px' : null"
        (pointerdown)="onPointerDown($event)"
      >
        <div class="relative group">
          
          <!-- Dismiss / Remove Button (Removeable Feature) -->
          <button
            type="button"
            (click)="dismissBot($event)"
            title="Remove AI Assistant from screen"
            aria-label="Remove AI Assistant"
            class="bot-dismiss-btn absolute -top-2 -right-2 z-50 w-6 h-6 rounded-full bg-zinc-900 border border-white/30 text-zinc-400 hover:text-white hover:bg-red-600 transition-all flex items-center justify-center cursor-pointer shadow-xl hover:scale-110"
          >
            <i class="bx bx-x text-sm font-bold pointer-events-none"></i>
          </button>

          <!-- Main Draggable & Clickable Trigger Button -->
          <button
            type="button"
            (click)="onClickTrigger($event)"
            [style.cursor]="isDragging() ? 'grabbing' : 'grab'"
            class="relative flex items-center gap-2.5 sm:gap-3 p-2 sm:px-4 sm:py-2.5 rounded-full bg-[#0c0c0e]/95 backdrop-blur-xl border border-white/20 hover:border-[#ff3b00]/80 shadow-[0_12px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_40px_rgba(255,59,0,0.4)] transition-all duration-300 text-white cursor-pointer active:scale-95"
            aria-label="Open AI Assistant"
          >
            <!-- Drag Handle Hint -->
            <span class="hidden sm:inline-flex text-zinc-500 group-hover:text-zinc-300 transition-colors pointer-events-none pr-0.5">
              <i class="bx bx-grid-vertical text-base"></i>
            </span>

            <!-- Glass Bot Icon -->
            <div class="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 p-1 shadow-inner group-hover:rotate-6 transition-transform">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color-glass/48/bot.png"
                alt="bot"
                class="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,59,0,0.6)]"
              />
              <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c0c0e] animate-pulse"></span>
            </div>

            <!-- Label -->
            <div class="text-left font-mono pr-1 hidden sm:block">
              <div class="text-xs font-bold leading-tight flex items-center gap-1.5 text-zinc-100">
                <span>AI COPILOT</span>
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div class="text-[10px] text-zinc-400 leading-none mt-0.5">
                Drag anywhere &middot; Click to Chat
              </div>
            </div>

            <!-- Unread Badge -->
            @if (chatService.unreadCount() > 0) {
              <span class="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff3b00] text-[10px] font-mono font-bold text-white shadow-md ring-2 ring-black">
                {{ chatService.unreadCount() }}
              </span>
            }
          </button>
        </div>
      </div>
    }

    <!-- ==================== RESTORE BUTTON (When dismissed) ==================== -->
    @if (isDismissed()) {
      <div class="fixed bottom-4 right-4 z-40 animate-in fade-in duration-300">
        <button
          type="button"
          (click)="restoreBot()"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0c0e]/95 border border-white/20 text-zinc-300 hover:text-white hover:border-[#ff3b00] text-xs font-mono transition-all shadow-xl cursor-pointer backdrop-blur-md hover:scale-105"
          title="Restore AI Assistant icon"
        >
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/color-glass/48/bot.png"
            alt="bot"
            class="w-4 h-4 object-contain"
          />
          <span>Restore AI Copilot</span>
          <i class="bx bx-undo text-sm text-[#ff3b00]"></i>
        </button>
      </div>
    }

    <!-- ==================== EXPANDED CHAT WINDOW (Independently Fixed in Viewport) ==================== -->
    @if (chatService.isOpen()) {
      <div
        class="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-bottom-6 fade-in duration-300 text-white bg-[#0c0c0e]/95 backdrop-blur-2xl"
      >
        <!-- Header -->
        <div class="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="relative w-9 h-9 rounded-2xl bg-white/10 border border-white/15 p-1 flex items-center justify-center shadow-md">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color-glass/48/bot.png"
                alt="bot"
                class="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(255,59,0,0.5)]"
              />
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900 animate-pulse"></span>
            </div>
            <div>
              <div class="font-display font-bold text-sm tracking-tight flex items-center gap-1.5 leading-none">
                <span>Sunny AI Assistant</span>
                <span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#ff3b00]/15 text-[#ff3b00] border border-[#ff3b00]/30">
                  MEAN &middot; MERN
                </span>
              </div>
              <div class="text-[11px] font-mono text-zinc-400 mt-1 leading-none flex items-center gap-1.5">
                <span class="text-emerald-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online &middot; Full-Stack Copilot
                </span>
              </div>
            </div>
          </div>

          <!-- Controls (Clear / Reset, Minimize & Dismiss) -->
          <div class="flex items-center gap-1">
            <button
              type="button"
              (click)="chatService.clearChat()"
              title="Restart conversation"
              class="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm flex items-center justify-center"
              aria-label="Restart chat"
            >
              <i class="bx bx-reset"></i>
            </button>
            <button
              type="button"
              (click)="chatService.closeChat()"
              title="Minimize chat"
              class="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm flex items-center justify-center font-bold"
              aria-label="Minimize chat"
            >
              <i class="bx bx-minus"></i>
            </button>
            <button
              type="button"
              (click)="dismissBot($event)"
              title="Remove AI Bot from screen"
              class="p-1.5 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer text-sm flex items-center justify-center font-bold"
              aria-label="Remove AI Bot from screen"
            >
              <i class="bx bx-x text-base"></i>
            </button>
          </div>
        </div>

        <!-- Message Thread -->
        <div
          #messageContainer
          class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs sm:text-sm"
        >
          @for (msg of chatService.messages(); track msg.id) {
            <!-- Assistant Message -->
            @if (msg.sender === 'assistant') {
              <div class="flex items-start gap-2.5 max-w-[92%] animate-in fade-in duration-200">
                <div class="w-6 h-6 rounded-full bg-white/10 border border-white/15 p-0.5 flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                  <img
                    width="48"
                    height="48"
                    src="https://img.icons8.com/color-glass/48/bot.png"
                    alt="bot"
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="space-y-2">
                  <div
                    class="p-3.5 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-zinc-200 leading-relaxed shadow-xs whitespace-pre-line"
                    [innerHTML]="formatText(msg.text)"
                  ></div>

                  <!-- Quick Action Chips -->
                  @if (msg.actions && msg.actions.length > 0) {
                    <div class="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
                      @for (act of msg.actions; track act.label) {
                        <button
                          type="button"
                          (click)="executeAction(act)"
                          class="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-200 border border-white/10 hover:border-[#ff3b00] hover:text-[#ff3b00] transition-all cursor-pointer shadow-2xs flex items-center gap-1 font-medium"
                        >
                          <span>{{ act.label }}</span>
                          <i class="bx bx-right-arrow-alt text-xs text-[#ff3b00]"></i>
                        </button>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <!-- User Message -->
            @if (msg.sender === 'user') {
              <div class="flex justify-end animate-in fade-in duration-200">
                <div class="max-w-[85%] p-3.5 rounded-2xl rounded-tr-sm bg-white text-black leading-relaxed shadow-sm font-medium">
                  {{ msg.text }}
                </div>
              </div>
            }
          }

          <!-- Typing Indicator -->
          @if (chatService.isTyping()) {
            <div class="flex items-center gap-2 text-zinc-400 font-mono text-xs animate-in fade-in">
              <div class="w-6 h-6 rounded-full bg-white/10 border border-white/15 p-0.5 flex items-center justify-center">
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/color-glass/48/bot.png"
                  alt="bot"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="p-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff3b00] animate-bounce [animation-delay:-0.3s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff3b00] animate-bounce [animation-delay:-0.15s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff3b00] animate-bounce"></span>
                <span class="text-[11px] text-zinc-400 font-mono ml-1.5">thinking...</span>
              </div>
            </div>
          }
        </div>

        <!-- Suggested Starter Questions -->
        @if (chatService.messages().length <= 2 && !chatService.isTyping()) {
          <div class="px-4 py-2 border-t border-white/5 bg-white/[0.02]">
            <div class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <i class="bx bx-bulb text-amber-400"></i>
              <span>Suggested questions:</span>
            </div>
            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              @for (prompt of quickPrompts; track prompt) {
                <button
                  type="button"
                  (click)="submitPrompt(prompt)"
                  class="px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-900 text-zinc-300 border border-white/10 hover:border-[#ff3b00] hover:text-[#ff3b00] whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
                >
                  {{ prompt }}
                </button>
              }
            </div>
          </div>
        }

        <!-- Input Footer -->
        <div class="p-3 border-t border-white/10 bg-white/5">
          <form (submit)="onSubmit($event)" class="flex items-center gap-2">
            <input
              #chatInput
              type="text"
              [(ngModel)]="inputText"
              name="chatQuery"
              placeholder="Ask about Sunny's MEAN/MERN stack, WorkLoader or APIs..."
              class="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#ff3b00] transition-colors placeholder:text-zinc-500 shadow-2xs text-white"
              [disabled]="chatService.isTyping()"
              autocomplete="off"
            />
            <button
              type="submit"
              [disabled]="!inputText.trim() || chatService.isTyping()"
              class="px-3.5 py-2.5 rounded-xl bg-[#ff3b00] text-white hover:bg-[#ff5522] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-xs shadow-md flex items-center justify-center flex-shrink-0"
              aria-label="Send query"
            >
              <i class="bx bx-send text-base"></i>
            </button>
          </form>
          <div class="text-[10px] font-mono text-zinc-400 text-center mt-1.5 flex items-center justify-center gap-1.5">
            <span class="text-emerald-400 font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Powered by Google Gemini &middot; Architecture Copilot</span>
            </span>
          </div>
        </div>

      </div>
    }
  `
})
export class ChatAgentComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly chatService = inject(ChatService);
  private readonly sound = inject(SoundService);

  @ViewChild('messageContainer') private messageContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') private chatInput?: ElementRef<HTMLInputElement>;

  @Output() openDemoModal = new EventEmitter<ProjectItem>();
  @Output() copyEmailTriggered = new EventEmitter<string>();

  inputText = '';

  // Moveable & Removeable State
  readonly isDismissed = signal<boolean>(false);
  readonly isDragging = signal<boolean>(false);
  readonly position = signal<{ x: number; y: number }>({ x: -1, y: -1 });

  private dragStartPos = { x: 0, y: 0 };
  private elemStartPos = { x: 0, y: 0 };
  private hasMoved = false;

  readonly quickPrompts = [
    'Current job at Tetranetics',
    'What are your core skills?',
    'Show me your projects',
    'How can I contact Sunny?'
  ];

  constructor() {
    // Auto-scroll whenever messages change
    effect(() => {
      const msgs = this.chatService.messages();
      const isTyping = this.chatService.isTyping();
      if ((msgs || isTyping) && typeof window !== 'undefined') {
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });

    // Auto focus input when chat opens
    effect(() => {
      if (this.chatService.isOpen() && typeof window !== 'undefined') {
        setTimeout(() => {
          this.chatInput?.nativeElement?.focus();
          this.scrollToBottom();
        }, 150);
      }
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onWindowResize, { passive: true });
    }
  }

  ngAfterViewInit() {
    this.initDefaultPosition();
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

  private initDefaultPosition() {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 640;
    const widgetW = isMobile ? 65 : 210;
    const widgetH = 55;
    const defaultX = Math.max(16, window.innerWidth - widgetW - 24);
    const defaultY = Math.max(16, window.innerHeight - widgetH - 24);
    this.position.set({ x: defaultX, y: defaultY });
  }

  private onWindowResize = () => {
    if (this.position().x < 0) return;
    const isMobile = window.innerWidth < 640;
    const widgetW = isMobile ? 65 : 210;
    const widgetH = 55;
    const maxX = Math.max(10, window.innerWidth - widgetW - 10);
    const maxY = Math.max(10, window.innerHeight - widgetH - 10);

    this.position.update(pos => ({
      x: Math.min(Math.max(10, pos.x), maxX),
      y: Math.min(Math.max(10, pos.y), maxY)
    }));
  };

  onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('.bot-dismiss-btn')) return;

    this.dragStartPos = { x: e.clientX, y: e.clientY };
    this.elemStartPos = { ...this.position() };
    this.hasMoved = false;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - this.dragStartPos.x;
      const dy = moveEv.clientY - this.dragStartPos.y;
      if (Math.hypot(dx, dy) > 8) {
        this.hasMoved = true;
        this.isDragging.set(true);

        const isMobile = window.innerWidth < 640;
        const widgetW = isMobile ? 65 : 210;
        const widgetH = 55;
        const maxX = Math.max(10, window.innerWidth - widgetW - 10);
        const maxY = Math.max(10, window.innerHeight - widgetH - 10);

        const newX = Math.min(Math.max(10, this.elemStartPos.x + dx), maxX);
        const newY = Math.min(Math.max(10, this.elemStartPos.y + dy), maxY);
        this.position.set({ x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setTimeout(() => this.isDragging.set(false), 50);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { once: true });
    window.addEventListener('pointercancel', onPointerUp, { once: true });
  }

  onClickTrigger(e: MouseEvent) {
    if (this.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.sound.playClick();
    this.chatService.openChat();
  }

  dismissBot(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.sound.playPop();
    this.isDismissed.set(true);
    this.chatService.closeChat();
  }

  restoreBot() {
    this.sound.playClick();
    this.isDismissed.set(false);
    this.initDefaultPosition();
  }

  formatText(text: string): string {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-950 dark:text-white">$1</strong>');
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.inputText.trim()) return;
    const query = this.inputText;
    this.inputText = '';
    this.chatService.sendMessage(query);
  }

  submitPrompt(prompt: string) {
    this.chatService.sendMessage(prompt);
  }

  executeAction(action: ChatAction) {
    this.sound.playClick();

    switch (action.type) {
      case 'prompt':
        if (action.payload) {
          this.chatService.sendMessage(action.payload);
        }
        break;

      case 'copy-email':
        this.copyEmailTriggered.emit(action.payload || 'sunverma192@gmail.com');
        break;

      case 'call':
        if (typeof window !== 'undefined') {
          window.location.href = `tel:${action.payload || '+919817245565'}`;
        }
        break;

      case 'scroll-section':
        if (typeof document !== 'undefined' && action.payload) {
          const el = document.getElementById(action.payload);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;

      case 'open-demo':
        if (action.payload) {
          const found = PROJECTS_DATA.find(p => p.id === action.payload);
          if (found) {
            this.openDemoModal.emit(found);
          }
        }
        break;
    }
  }

  private scrollToBottom() {
    if (this.messageContainer) {
      const el = this.messageContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
