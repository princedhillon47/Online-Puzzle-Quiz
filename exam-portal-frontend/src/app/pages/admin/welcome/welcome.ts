import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 add ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth';
import { CategoryService } from '../../../services/category';
import { QuizService } from '../../../services/quiz';
import { Router, NavigationEnd } from '@angular/router'; // 👈 add Router, NavigationEnd
import { filter } from 'rxjs/operators'; // 👈 add filter

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class WelcomeComponent implements OnInit {
  adminName = '';
  categoryCount = 0;
  quizCount = 0;

  constructor(
    private auth: AuthService,
    private categoryService: CategoryService,
    private quizService: QuizService,
    private router: Router, // 👈 inject Router
    private cdr: ChangeDetectorRef, // 👈 inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.adminName = this.auth.getUser()?.firstName || 'Admin';
    this.loadCounts();

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.loadCounts();
    });
  }

  loadCounts(): void {
    this.categoryService.categories().subscribe({
      next: (data: any) => {
        this.categoryCount = data.length;
        this.cdr.detectChanges(); // 👈 force update
      },
    });

    this.quizService.quizzes().subscribe({
      next: (data: any) => {
        this.quizCount = data.length;
        this.cdr.detectChanges(); // 👈 force update
      },
    });
  }
}
