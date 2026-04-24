import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category';
import { Router } from '@angular/router'; // 1. Import Router

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatSnackBarModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss'
})
export class AddCategoryComponent {

  category = {
    title: '',
    description: ''
  };

  // 2. Inject the Router inside the constructor
  constructor(
    private categoryService: CategoryService, 
    private snack: MatSnackBar,
    private router: Router 
  ) {}

  formSubmit() {
    if (this.category.title.trim() == '' || this.category.title == null) {
      this.snack.open('Title Required !!', '', { duration: 3000 });
      return;
    }

    // Call server to add category
    this.categoryService.addCategory(this.category).subscribe({
      next: (data: any) => {
        this.category.title = '';
        this.category.description = '';
        this.snack.open('Category Added Successfully!', 'Close', { duration: 3000 });
        
        // 3. ADD THIS LINE: Automatically redirect to the View Categories page!
        this.router.navigate(['/admin/categories']);
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Server error !!', 'Close', { duration: 3000 });
      }
    });
  }
}