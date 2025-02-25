import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-css-list',
  template: `
    <div class="list-container">
      <header class="list-header">
        <div class="header-content">
          <h1>CSS Concepts ({{filteredConcepts.length}})</h1>
          <p>Learn CSS from basic to advanced concepts with interactive examples and quizzes.</p>
        </div>
        
        <div class="filters">
          <mat-form-field appearance="outline">
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
      </header>

      <div class="concepts-grid">
        <mat-card *ngFor="let concept of filteredConcepts" class="concept-card" [class]="concept.difficulty">
          <mat-card-header>
            <mat-icon [class]="concept.difficulty">{{ getDifficultyIcon(concept.difficulty) }}</mat-icon>
            <mat-card-title>{{ concept.title }}</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <p>{{ concept.description }}</p>
            <div class="concept-meta">
              <div class="meta-item">
                <mat-icon>quiz</mat-icon>
                <span>{{ concept.quiz.length || 0 }} questions</span>
              </div>
              <div class="meta-item">
                <mat-icon>code</mat-icon>
                <span>{{ concept.interactiveExamples.length || 0 }} examples</span>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="learnConcept(concept.id)">
              Learn More
              <mat-icon>arrow_forward</mat-icon>
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
      background-color: var(--background-color);
      color: var(--text-color);
      transition: all var(--transition-speed) ease;

      .list-header {
        text-align: center;
        margin-bottom: 3rem;

        .header-content {
          margin-bottom: 2rem;

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
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;

          mat-form-field {
            width: 250px;
          }
        }
      }

      .concepts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;

        .concept-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-speed), box-shadow var(--transition-speed);
          background-color: var(--card-color);
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 8px var(--shadow-color);

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px var(--shadow-color);
          }

          &.beginner {
            border-top: 4px solid var(--easy-bg);
          }

          &.intermediate {
            border-top: 4px solid var(--medium-bg);
          }

          &.advanced {
            border-top: 4px solid var(--hard-bg);
          }

          mat-card-header {
            margin-bottom: 1rem;

            mat-icon {
              color: var(--text-light);

              &.beginner {
                color: var(--easy-bg);
              }

              &.intermediate {
                color: var(--medium-bg);
              }

              &.advanced {
                color: var(--hard-bg);
              }
            }

            mat-card-title {
              color: var(--text-color);
            }
          }

          mat-card-content {
            flex: 1;
            
            p {
              color: var(--text-color);
              margin-bottom: 1rem;
            }

            .concept-meta {
              display: flex;
              gap: 1rem;
              margin-top: auto;

              .meta-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-light);

                mat-icon {
                  font-size: 1.2rem;
                  width: 1.2rem;
                  height: 1.2rem;
                  color: var(--text-light);
                }
              }
            }
          }

          mat-card-actions {
            padding: 1rem;
            border-top: 1px solid var(--border-color);
            margin-top: auto;

            button {
              background-color: var(--primary-color);
              color: var(--primary-contrast);
            }
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
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class CssListComponent implements OnInit {
  concepts: ConceptContent[] = [];
  filteredConcepts: ConceptContent[] = [];
  searchQuery: string = '';
  selectedDifficulty: string = '';
  sortBy: 'title' | 'difficulty' = 'title';

  constructor(
    private conceptService: ConceptService,
    private router: Router
  ) {}

  ngOnInit() {
    this.conceptService.getConcepts('css').subscribe(concepts => {
      this.concepts = concepts;
      this.filterConcepts();
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
    const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };

    this.filteredConcepts.sort((a, b) => {
      if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
    });
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

  learnConcept(conceptId: string) {
    this.router.navigate(['/css', 'concept', conceptId]);
  }
}