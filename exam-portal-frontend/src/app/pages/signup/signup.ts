import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user'; // Import the service

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    FormsModule, 
    MatCardModule, 
    MatSnackBarModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  
  public user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  // Inject the UserService and MatSnackBar
  constructor(private userService: UserService, private snack: MatSnackBar) {}

  formSubmit() {
    // Basic validation
    if (this.user.username == '' || this.user.username == null) {
      this.snack.open('Username is required !!', '', { duration: 3000 });
      return;
    }

    // Call the backend service
    this.userService.addUser(this.user).subscribe({
      next: (data: any) => {
        console.log('Success:', data);
        this.snack.open('Success! User registered successfully.', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.log('Error:', error);
        this.snack.open('Something went wrong!', 'Close', { duration: 3000 });
      }
    });
  }
}