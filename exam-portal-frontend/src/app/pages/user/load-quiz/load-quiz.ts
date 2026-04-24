import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizService } from '../../../services/quiz';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-load-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './load-quiz.html',
  styleUrl: './load-quiz.scss',
})
export class LoadQuizComponent implements OnInit {
  catId: any;
  quizzes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private router: Router,
    private cdr: ChangeDetectorRef, // Your UI refresh fix
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // 1. Subscribe to params so it updates dynamically if the category changes
    this.route.params.subscribe((params) => {
      this.catId = params['catId'];
      this.loadActiveQuizzes();
    });

    // 2. Your foolproof NavigationEnd fix
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.loadActiveQuizzes();
    });
  }

  loadActiveQuizzes() {
    this.quizService.quizzes().subscribe({
      next: (data: any) => {
        let filteredQuizzes = [];

        if (this.catId == 0) {
          // If 0, load ALL ACTIVE quizzes
          filteredQuizzes = data.filter((q: any) => q.active);
        } else {
          // If a category is selected, load ACTIVE quizzes for that specific category
          filteredQuizzes = data.filter((q: any) => q.active && q.category.cid == this.catId);
        }

        // Spread operator and detectChanges to guarantee UI update
        this.quizzes = [...filteredQuizzes];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error loading quizzes', 'Close', { duration: 3000 });
      },
    });
  }
}
