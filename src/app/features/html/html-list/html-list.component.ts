import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-html-list',
  template: `
    <div class="concept-list">
      <header class="header">
        <h1>HTML Concepts</h1>
        <p>Master the building blocks of web development</p>
      </header>

      <div class="concepts-grid">
        <mat-card *ngFor="let concept of concepts" class="concept-card" (click)="navigateToConcept(concept.id)">
          <mat-card-header>
            <mat-icon [class]="concept.difficulty">{{ getDifficultyIcon(concept.difficulty) }}</mat-icon>
            <mat-card-title>{{ concept.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ concept.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Learn More</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .concept-list {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      .header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          color: #666;
        }
      }

      .concepts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .concept-card {
        cursor: pointer;
        transition: transform 0.2s ease-in-out;

        &:hover {
          transform: translateY(-5px);
        }

        mat-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        mat-icon {
          &.beginner { color: #4CAF50; }
          &.intermediate { color: #FF9800; }
          &.advanced { color: #F44336; }
        }
      }
    }
  `],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgFor
  ]
})
export class HtmlListComponent implements OnInit {
  concepts: ConceptContent[] = [];

  constructor(
    private router: Router,
    private conceptService: ConceptService
  ) {}

  ngOnInit() {
    this.conceptService.getConcepts('html').subscribe(concepts => {
      this.concepts = concepts;
    });
  }

  navigateToConcept(conceptId: string): void {
    this.router.navigate(['/html', conceptId]);
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'school';
      case 'intermediate':
        return 'trending_up';
      case 'advanced':
        return 'psychology';
      default:
        return 'help';
    }
  }
} 