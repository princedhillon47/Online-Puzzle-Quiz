import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionService } from '../../../services/question';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, FormsModule, MatSnackBarModule
  ],
  templateUrl: './add-question.html',
  styleUrl: './add-question.scss'
})
export class AddQuestionComponent implements OnInit {

  qId: any;
  qTitle: any;

  // Question object matching the Spring Boot entity
  question = {
    quiz: {
      qId: '',
      qid: ''
    },
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: ''
  };

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Grab the Quiz ID and Title from the URL
    this.qId = this.route.snapshot.params['qid'];
    this.qTitle = this.route.snapshot.params['title'];
    
    // Assign the Quiz ID to the question object
    this.question.quiz.qId = this.qId;
    this.question.quiz.qid = this.qId;
  }

  formSubmit() {
    if (this.question.content.trim() == '' || this.question.content == null) {
      this.snack.open('Question content is required', '', { duration: 3000 });
      return;
    }
    if (this.question.option1.trim() == '' || this.question.option2.trim() == '') {
      this.snack.open('Minimum two options are required', '', { duration: 3000 });
      return;
    }
    if (this.question.answer.trim() == '') {
      this.snack.open('Please select the correct answer', '', { duration: 3000 });
      return;
    }

    // Call server to add the question
    this.questionService.addQuestion(this.question).subscribe({
      next: (data: any) => {
        this.snack.open('Question Added Successfully!', 'Close', { duration: 3000 });
        
        // Reset the form but keep the quiz ID intact
        this.question.content = '';
        this.question.option1 = '';
        this.question.option2 = '';
        this.question.option3 = '';
        this.question.option4 = '';
        this.question.answer = '';
      },
      error: (error) => {
        console.log(error);
        this.snack.open('Error saving question to the server', 'Close', { duration: 3000 });
      }
    });
  }
}