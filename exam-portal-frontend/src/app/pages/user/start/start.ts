import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  PLATFORM_ID,
  NgZone,
  HostListener,
} from '@angular/core';
import { CommonModule, LocationStrategy, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../services/question';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatRadioModule,
    FormsModule,
  ],
  templateUrl: './start.html',
  styleUrl: './start.scss',
})
export class StartComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  qid: any;
  questions: any[] = [];

  marksGot = 0;
  correctAnswers = 0;
  attempted = 0;
  isSubmit = false;
  timer: any;

  // Anti-cheating variables
  warnings = 0;
  maxWarnings = 3;

  constructor(
    private locationSt: LocationStrategy,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.preventBackButton();
    }
    this.qid = this.route.snapshot.params['qid'];
    this.loadQuestions();
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

  loadQuestions() {
    this.questionService.getQuestionsOfQuiz(this.qid).subscribe({
      next: (data: any) => {
        this.questions = data;

        // Add empty givenAnswer property
        this.questions.forEach((q: any) => {
          q['givenAnswer'] = '';
        });

        // Calculate timer
        this.timer = this.questions.length * 2 * 60;
        this.cdr.detectChanges();
        this.startTimer();
      },
      error: (error: any) => {
        console.log(error);
        alert(
          'Failed to load questions. Your session might have expired. Please log out and log back in.',
        );
      },
    });
  }

  startTimer() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        let t = window.setInterval(() => {
          if (this.timer != null && this.timer <= 0) {
            this.ngZone.run(() => {
              this.evalQuiz();
            });
            clearInterval(t);
          } else if (this.timer != null) {
            this.timer--;
            this.ngZone.run(() => {
              this.cdr.detectChanges();
            });
          }
        }, 1000);
      });
    }
  }

  getFormattedTime() {
    if (this.timer == null) {
      return 'Loading timer...';
    }
    let mm = Math.floor(this.timer / 60);
    let ss = this.timer - mm * 60;
    return `${mm} min : ${ss} sec`;
  }

  submitQuiz() {
    if (confirm('Are you sure you want to submit the exam?')) {
      this.evalQuiz();
    }
  }

  evalQuiz() {
    this.questionService.evalQuiz(this.questions).subscribe({
      next: (data: any) => {
        this.marksGot = parseFloat(Number(data.marksGot).toFixed(2));
        this.correctAnswers = data.correctAnswers;
        this.attempted = data.attempted;

        this.isSubmit = true;

        // EXIT FULLSCREEN WHEN EXAM IS DONE
        this.closeFullscreen();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log('Error evaluating quiz: ', error);
      },
    });
  }

  // ==========================================
  // ANTI-CHEATING & FULLSCREEN METHODS
  // ==========================================

  // 1. Prevent Right-Click
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  // 2. Prevent Keyboard Shortcuts (Copy, Paste, F12)
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      (event.ctrlKey && (event.key === 'c' || event.key === 'v' || event.key === 'x')) ||
      event.metaKey ||
      event.key === 'F12'
    ) {
      event.preventDefault();
    }
  }

  // 3. Detect Tab Switching or Window Minimizing
  @HostListener('document:visibilitychange', ['$event'])
  handleVisibilityChange(event: any) {
    if (isPlatformBrowser(this.platformId) && document.hidden && !this.isSubmit) {
      this.warnings++;

      if (this.warnings >= this.maxWarnings) {
        alert(
          'You have left the exam screen too many times. The exam is automatically submitting.',
        );
        this.evalQuiz();
      } else {
        alert(
          `Warning ${this.warnings} of ${this.maxWarnings}: Please do not switch tabs or minimize the browser. Your exam will be cancelled if you do this again.`,
        );
      }
    }
  }

  // 4. Strict Fullscreen Exit Detection (Esc key or F11)
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullScreenChange(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      const doc = document as any;
      const isCurrentlyFullscreen =
        doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement;

      // If they exited fullscreen AND they haven't legitimately submitted yet
      if (!isCurrentlyFullscreen && !this.isSubmit) {
        alert('SECURITY ALERT: You exited fullscreen mode! The exam is automatically submitting.');
        this.evalQuiz();
      }
    }
  }

  // 5. Exit fullscreen safely upon legitimate submission
  closeFullscreen() {
    if (isPlatformBrowser(this.platformId)) {
      const doc = document as any;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }
}
