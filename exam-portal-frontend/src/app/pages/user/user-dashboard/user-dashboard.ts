import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar'; // Ensure this matches your path

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  // Add RouterModule and SidebarComponent here!
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboardComponent {}
