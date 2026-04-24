import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// IMPORTANT: Adjust this path to match exactly where your auth/login service is
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Retrieve the user data from local storage via your service
    this.user = this.auth.getUser();
  }
}
