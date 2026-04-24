import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category';
import { QuizService } from '../../../services/quiz';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatSelectModule, MatSlideToggleModule, 
    FormsModule, MatSnackBarModule
  ],
  templateUrl: './add-quiz.html',
  styleUrl: './add-quiz.scss'
})
export class AddQuizComponent implements OnInit {

  categories: any = [];

  // This matches the Spring Boot Quiz entity structure
  quizData = {
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    active: true,
    category: {
      cid: '' // We only need the ID to link it in the database
    }
  };

  constructor(
    private categoryService: CategoryService,
    private quizService: QuizService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load categories for the dropdown when the page loads
    this.categoryService.categories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error loading categories', '', { duration: 3000 });
      }
    });
  }

  formSubmit() {
    if (this.quizData.title.trim() == '' || this.quizData.title == null) {
      this.snack.open('Title Required !!', '', { duration: 3000 });
      return;
    }

    // Call server to add the quiz
    this.quizService.addQuiz(this.quizData).subscribe({
      next: (data: any) => {
        this.snack.open('Quiz Added Successfully!', 'Close', { duration: 3000 });
        
        // Redirect to the view-quizzes page
        this.router.navigate(['/admin/quizzes']);
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error while adding quiz', 'Close', { duration: 3000 });
      }
    });
  }
}