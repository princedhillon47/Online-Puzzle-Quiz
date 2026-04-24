import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 add ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CategoryService } from '../../../services/category';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './view-categories.html',
  styleUrl: './view-categories.scss',
})
export class ViewCategoriesComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private snack: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef, // 👈 inject this
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.loadCategories();
    });
  }

  loadCategories(): void {
    this.categoryService.categories().subscribe({
      next: (data: any) => {
        this.categories = [...data]; // 👈 spread forces new array reference
        this.cdr.detectChanges(); // 👈 manually trigger change detection
        console.log('Categories loaded:', this.categories);
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error loading categories from the server', 'Close', { duration: 3000 });
      },
    });
  }
}
