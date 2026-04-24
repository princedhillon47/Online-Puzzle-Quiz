import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { QuizService } from '../../../services/quiz';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-quizzes',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, MatSnackBarModule],
  templateUrl: './view-quizzes.html',
  styleUrl: './view-quizzes.scss',
})
export class ViewQuizzesComponent implements OnInit {
  quizzes: any[] = [];

  constructor(
    private quizService: QuizService,
    private snack: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef, // 👈 inject this
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.loadQuizzes();
    });
  }

  loadQuizzes(): void {
    this.quizService.quizzes().subscribe({
      next: (data: any) => {
        this.quizzes = [...data]; // 👈 spread forces new array reference
        this.cdr.detectChanges(); // 👈 manually trigger change detection
        console.log('Quizzes loaded:', this.quizzes);
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error loading quizzes from the server', 'Close', { duration: 3000 });
      },
    });
  }

  deleteQuiz(qId: any) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.deleteQuiz(qId).subscribe({
        next: (data: any) => {
          this.quizzes = this.quizzes.filter((quiz: any) => quiz.qId != qId);
          this.cdr.detectChanges(); // 👈 also here after delete
          this.snack.open('Quiz deleted successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.log(error);
          this.snack.open('Error deleting quiz from the server', 'Close', { duration: 3000 });
        },
      });
    }
  }
}
