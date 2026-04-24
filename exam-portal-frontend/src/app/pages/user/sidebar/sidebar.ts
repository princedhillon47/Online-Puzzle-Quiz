import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth'; // Check your auth path

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  public logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
