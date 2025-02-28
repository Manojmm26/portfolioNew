import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-technical-analysis-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <header class="header">
        <h1>Technical Analysis Concepts ({{filteredConcepts.length}})</h1>
        <p>Learn about various technical analysis concepts and indicators used in financial markets</p>
      </header>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search concepts..." (input)="applyFilters()">
          <button *ngIf="searchTerm" matSuffix mat-icon-button aria-label="Clear" (click)="searchTerm=''; applyFilters()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Difficulty</mat-label>
          <mat-select [(ngModel)]="selectedDifficulty" (selectionChange)="applyFilters()">
            <mat-option value="">All Levels</mat-option>
            <mat-option value="beginner">Beginner</mat-option>
            <mat-option value="intermediate">Intermediate</mat-option>
            <mat-option value="advanced">Advanced</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sort By</mat-label>
          <mat-select [(ngModel)]="sortBy" (selectionChange)="applyFilters()">
            <mat-option value="title">Title</mat-option>
            <mat-option value="difficulty">Difficulty</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="concepts-grid" *ngIf="!loading">
        <mat-card class="concept-card" *ngFor="let concept of filteredConcepts" (click)="navigateToConcept(concept.id)">
          <mat-card-header>
            <mat-card-title>{{ concept.title }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip-set>
                <mat-chip [ngClass]="getDifficultyClass(concept.difficulty)">
                  {{ concept.difficulty | titlecase }}
                </mat-chip>
              </mat-chip-set>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ concept.description }}</p>
          </mat-card-content>
          <mat-divider></mat-divider>
          <mat-card-actions>
            <button mat-button color="primary">LEARN MORE</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredConcepts.length === 0">
        <mat-icon>search_off</mat-icon>
        <h2>No concepts found</h2>
        <p>Try adjusting your search or filters</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .header p {
      font-size: 1.2rem;
      color: #666;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .concept-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .concept-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    mat-card-content {
      flex-grow: 1;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
    }

    .beginner-chip {
      background-color: #4CAF50 !important;
      color: white !important;
    }

    .intermediate-chip {
      background-color: #2196F3 !important;
      color: white !important;
    }

    .advanced-chip {
      background-color: #F44336 !important;
      color: white !important;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      height: 4rem;
      width: 4rem;
      margin-bottom: 1rem;
    }
  `]
})
export class TechnicalAnalysisListComponent implements OnInit {
  concepts: ConceptContent[] = [];
  filteredConcepts: ConceptContent[] = [];
  loading = true;
  searchTerm = '';
  selectedDifficulty = '';
  sortBy = 'title';

  constructor(
    private conceptService: ConceptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConcepts();
  }

  loadConcepts(): void {
    this.loading = true;
    this.conceptService.getTechnicalAnalysisConcepts().subscribe({
      next: (concepts) => {
        this.concepts = concepts;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading concepts:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.concepts];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(concept => 
        concept.title.toLowerCase().includes(searchLower) || 
        concept.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply difficulty filter
    if (this.selectedDifficulty) {
      filtered = filtered.filter(concept => concept.difficulty === this.selectedDifficulty);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === 'difficulty') {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return 0;
    });

    this.filteredConcepts = filtered;
  }

  navigateToConcept(id: string): void {
    this.router.navigate(['/technical-analysis/concept', id]);
  }

  getDifficultyClass(difficulty: string): string {
    return `${difficulty}-chip`;
  }
}
