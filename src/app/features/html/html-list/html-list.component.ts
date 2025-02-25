import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-html-list',
  template: `
    <div class="concept-list">
      <header class="header">
        <h1>HTML Concepts ({{filteredConcepts.length}})</h1>
        <p>Master the building blocks of web development</p>
      </header>

      <div class="filters">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search concepts</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="filterConcepts()" placeholder="Search by title or description">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Difficulty</mat-label>
          <mat-select [(ngModel)]="selectedDifficulty" (ngModelChange)="filterConcepts()">
            <mat-option value="">All levels</mat-option>
            <mat-option value="beginner">Beginner</mat-option>
            <mat-option value="intermediate">Intermediate</mat-option>
            <mat-option value="advanced">Advanced</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sort by</mat-label>
          <mat-select [(ngModel)]="sortBy" (ngModelChange)="sortConcepts()">
            <mat-option value="title">Title</mat-option>
            <mat-option value="difficulty">Difficulty</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="concepts-grid">
        <mat-card *ngFor="let concept of filteredConcepts" class="concept-card" (click)="navigateToConcept(concept.id)">
          <mat-card-header>
            <mat-chip-set>
              <mat-chip [class]="concept.difficulty">
                <mat-icon>{{ getDifficultyIcon(concept.difficulty) }}</mat-icon>
                {{ concept.difficulty | titlecase }}
              </mat-chip>
            </mat-chip-set>
            <mat-card-title>{{ concept.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ concept.description }}</p>
            <div class="concept-meta">
              <span class="meta-item" *ngIf="concept.quiz">
                <mat-icon>quiz</mat-icon>
                {{ concept.quiz.length }} questions
              </span>
              <span class="meta-item">
                <mat-icon>code</mat-icon>
                Example code
              </span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>school</mat-icon>
              Learn More
            </button>
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
      background-color: var(--background-color);
      color: var(--text-color);
      transition: all var(--transition-speed) ease;

      .header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          color: var(--text-light);
        }
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;

        .search-field {
          grid-column: 1 / -1;
        }

        mat-form-field {
          width: 100%;
        }
      }

      .concepts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .concept-card {
        cursor: pointer;
        transition: transform var(--transition-speed), box-shadow var(--transition-speed);
        background-color: var(--card-color);
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 8px var(--shadow-color);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px var(--shadow-color);
        }

        mat-card-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;

          mat-card-title {
            font-size: 1.5rem;
            color: var(--text-color);
          }
        }

        mat-card-content {
          p {
            color: var(--text-color);
            margin-bottom: 1rem;
          }

          .concept-meta {
            display: flex;
            gap: 1rem;
            color: var(--text-light);

            .meta-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;

              mat-icon {
                font-size: 1.2rem;
                width: 1.2rem;
                height: 1.2rem;
              }
            }
          }
        }

        mat-card-actions {
          padding: 1rem;
          border-top: 1px solid var(--border-color);

          button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary-color);
          }
        }

        mat-chip {
          &.beginner { 
            background-color: var(--easy-bg); 
            color: var(--easy-text); 
          }
          &.intermediate { 
            background-color: var(--medium-bg); 
            color: var(--medium-text); 
          }
          &.advanced { 
            background-color: var(--hard-bg); 
            color: var(--hard-text); 
          }
        }
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule
  ]
})
export class HtmlListComponent implements OnInit {
  concepts: ConceptContent[] = [];
  filteredConcepts: ConceptContent[] = [];
  searchQuery: string = '';
  selectedDifficulty: string = '';
  sortBy: 'title' | 'difficulty' = 'title';

  constructor(
    private router: Router,
    private conceptService: ConceptService
  ) {}

  ngOnInit() {
    this.conceptService.getConcepts('html').subscribe(concepts => {
      this.concepts = concepts;
      this.filteredConcepts = concepts;
      this.sortConcepts();
    });
  }

  filterConcepts() {
    this.filteredConcepts = this.concepts.filter(concept => {
      const matchesSearch = !this.searchQuery || 
        concept.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        concept.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesDifficulty = !this.selectedDifficulty || 
        concept.difficulty === this.selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });

    this.sortConcepts();
  }

  sortConcepts() {
    this.filteredConcepts.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        default:
          return 0;
      }
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