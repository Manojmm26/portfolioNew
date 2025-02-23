import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-javascript-list',
  template: `
    <div class="list-container">
      <header class="list-header">
        <h1>JavaScript Concepts</h1>
        <p>Master JavaScript with interactive examples, live coding, and quizzes</p>
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
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (ngModelChange)="filterConcepts()">
            <mat-option value="">All categories</mat-option>
            <mat-option value="fundamentals">Fundamentals</mat-option>
            <mat-option value="functions">Functions</mat-option>
            <mat-option value="objects">Objects</mat-option>
            <mat-option value="async">Async Programming</mat-option>
            <mat-option value="es6">ES6+ Features</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sort by</mat-label>
          <mat-select [(ngModel)]="sortBy" (ngModelChange)="sortConcepts()">
            <mat-option value="title">Title</mat-option>
            <mat-option value="difficulty">Difficulty</mat-option>
            <mat-option value="category">Category</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="concepts-grid">
        <mat-card *ngFor="let concept of filteredConcepts" class="concept-card" (click)="navigateToConcept(concept.id)">
          <mat-card-header>
            <mat-card-title>{{ concept.title }}</mat-card-title>
            <mat-chip-set>
              <mat-chip [class]="concept.difficulty">
                <mat-icon>{{ getDifficultyIcon(concept.difficulty) }}</mat-icon>
                {{ concept.difficulty | titlecase }}
              </mat-chip>
              <mat-chip>
                <mat-icon>{{ getCategoryIcon(concept.category) }}</mat-icon>
                {{ concept.category | titlecase }}
              </mat-chip>
            </mat-chip-set>
          </mat-card-header>
          <mat-card-content>
            <p>{{ concept.description }}</p>
            <div class="concept-meta">
              <span class="meta-item">
                <mat-icon>quiz</mat-icon>
                {{ concept.quiz.length }} questions
              </span>
              <span class="meta-item">
                <mat-icon>code</mat-icon>
                {{ concept.interactiveExamples.length || 0 }} examples
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
    .list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      .list-header {
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
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;

        .concept-card {
          cursor: pointer;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          mat-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;

            mat-card-title {
              font-size: 1.5rem;
              color: #333;
            }
          }

          mat-card-content {
            p {
              color: #666;
              margin-bottom: 1rem;
            }

            .concept-meta {
              display: flex;
              gap: 1rem;
              color: #666;

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
            border-top: 1px solid #eee;

            button {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
          }

          mat-chip {
            &.beginner { background-color: #4CAF50; color: white; }
            &.intermediate { background-color: #FF9800; color: white; }
            &.advanced { background-color: #F44336; color: white; }
          }
        }
      }

      @media (max-width: 768px) {
        padding: 1rem;

        .list-header {
          margin-bottom: 2rem;

          h1 {
            font-size: 2rem;
          }
        }

        .concepts-grid {
          grid-template-columns: 1fr;
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
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class JavascriptListComponent implements OnInit {
  concepts: ConceptContent[] = [];
  filteredConcepts: ConceptContent[] = [];
  searchQuery: string = '';
  selectedDifficulty: string = '';
  selectedCategory: string = '';
  sortBy: 'title' | 'difficulty' | 'category' = 'title';

  constructor(
    private conceptService: ConceptService,
    private router: Router
  ) {}

  ngOnInit() {
    this.conceptService.getConcepts('javascript').subscribe(concepts => {
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

      const matchesCategory = !this.selectedCategory || 
        concept.category === this.selectedCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
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
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }

  navigateToConcept(conceptId: string) {
    this.router.navigate(['/javascript/concept', conceptId]);
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

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'fundamentals':
        return 'school';
      case 'functions':
        return 'functions';
      case 'objects':
        return 'data_object';
      case 'async':
        return 'sync';
      case 'es6':
        return 'code';
      default:
        return 'help';
    }
  }
} 