import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 add ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router, NavigationEnd } from '@angular/router'; // 👈 add Router, NavigationEnd
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionService } from '../../../services/question';
import { filter } from 'rxjs/operators'; // 👈 add filter

@Component({
  selector: 'app-view-quiz-questions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './view-quiz-questions.html',
  styleUrl: './view-quiz-questions.scss',
})
export class ViewQuizQuestionsComponent implements OnInit {
  qId: any;
  qTitle: any;
  questions: any[] = [];
  q: any;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private snack: MatSnackBar,
    private router: Router, // 👈 inject Router
    private cdr: ChangeDetectorRef, // 👈 inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Read params and load on init
    this.qId = this.route.snapshot.params['qid'];
    this.qTitle = this.route.snapshot.params['title'];
    this.loadQuestions();

    // Re-load if route params change (e.g. navigating from one quiz to another)
    this.route.params.subscribe((params) => {
      this.qId = params['qid'];
      this.qTitle = params['title'];
      this.loadQuestions();
    });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.questionService.getQuestionsOfQuiz(this.qId).subscribe({
      next: (data: any) => {
        this.questions = [...data]; // 👈 spread forces new array reference
        this.cdr.detectChanges(); // 👈 force change detection
        console.log(this.questions);
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error loading questions', 'Close', { duration: 3000 });
      },
    });
  }
  deleteQuestion(quesId: any) {
    // Show a confirmation dialog
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(quesId).subscribe({
        next: (data: any) => {
          // Instantly remove the question from the screen
          this.questions = this.questions.filter((q: any) => q.quesId != quesId);

          this.snack.open('Question deleted successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.log(error);
          this.snack.open('Error deleting question from the server', 'Close', { duration: 3000 });
        },
      });
    }
  }
}
