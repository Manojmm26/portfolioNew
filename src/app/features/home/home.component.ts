import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgFor
  ]
})
export class HomeComponent {
  sections = [
    {
      title: 'HTML',
      path: '/html',
      description: 'Learn about HTML elements, forms, and semantic markup'
    },
    {
      title: 'CSS',
      path: '/css',
      description: 'Master CSS layouts, animations, and responsive design'
    },
    {
      title: 'JavaScript',
      path: '/javascript',
      description: 'Understand core JavaScript concepts and modern features'
    },
    {
      title: 'Angular',
      path: '/angular',
      description: 'Explore Angular components, services, and best practices'
    }
  ];

  constructor(private router: Router) {}

  navigateToSection(path: string): void {
    this.router.navigate([path]);
  }
} 