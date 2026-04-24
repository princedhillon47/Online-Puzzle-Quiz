import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, MatCardModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  
  loginData = { username: '', password: '' };

  // Inject the Router here
  constructor(private snack: MatSnackBar, private auth: AuthService, private router: Router) {}

  formSubmit() {
    if (this.loginData.username.trim() == '' || this.loginData.username == null) {
      this.snack.open('Username is required !! ', '', { duration: 3000 });
      return;
    }
    if (this.loginData.password.trim() == '' || this.loginData.password == null) {
      this.snack.open('Password is required !! ', '', { duration: 3000 });
      return;
    }

    // 1. Generate token
    this.auth.generateToken(this.loginData).subscribe({
      next: (data: any) => {
        // Save token
        this.auth.loginUser(data.token);
        
        // 2. Fetch the current logged-in user's details
        this.auth.getCurrentUser().subscribe({
          next: (user: any) => {
            this.auth.setUser(user);
            console.log("Logged in user details: ", user);
            this.auth.loginStatusSubject.next(true);

            // 3. Redirect based on role
            if (this.auth.getUserRole() == 'ADMIN') {
              // Redirect Admin to Admin Dashboard
              this.router.navigate(['admin']);
            } else if (this.auth.getUserRole() == 'NORMAL') {
              // Redirect Normal user to User Dashboard
              this.router.navigate(['user-dashboard']);
            } else {
              this.auth.logout();
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (error) => {
        this.snack.open('Invalid Details! Try again.', 'Close', { duration: 3000 });
      }
    });
  }
}