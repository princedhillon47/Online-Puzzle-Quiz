import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  user: any = null;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Set initial state when the page loads
    this.isLoggedIn = this.auth.isLoggedIn();
    this.user = this.auth.getUser();

    // Listen for changes from the login/logout actions
    this.auth.loginStatusSubject.asObservable().subscribe((data) => {
      this.isLoggedIn = this.auth.isLoggedIn();
      this.user = this.auth.getUser();
    });
  }

  public logout() {
    this.auth.logout();
    this.auth.loginStatusSubject.next(false); // Send signal that user logged out
    this.router.navigate(['login']);
  }
}