import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core'; // 1. Import ChangeDetectorRef
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { QuizService } from '../../../services/quiz';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './instructions.html',
  styleUrl: './instructions.scss',
})
export class InstructionsComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  qid: any;
  quiz: any;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private router: Router,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef, // 2. Inject it here
  ) {}

  ngOnInit(): void {
    this.qid = this.route.snapshot.params['qid'];
    console.log('Step 1: Extracted Quiz ID from URL ->', this.qid);

    this.quizService.getQuiz(this.qid).subscribe({
      next: (data: any) => {
        console.log('Step 2: Data received from Spring Boot ->', data);
        this.quiz = data;

        // 3. Force Angular to refresh the HTML screen!
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log('Step 2 FAILED: Error fetching quiz ->', error);
        this.snack.open('Error loading quiz instructions', 'Close', { duration: 3000 });
      },
    });
  }

  startQuiz() {
    if (confirm('Are you ready to begin the exam? The timer will start immediately.')) {
      this.openFullscreen();
      this.router.navigate(['/start/' + this.qid]);
    }
  }
  openFullscreen() {
    if (isPlatformBrowser(this.platformId)) {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    }
  }
}
