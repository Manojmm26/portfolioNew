import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-concept-list',
  template: `
    <div class="concept-list">
      <header>
        <h1>Manage Learning Concepts</h1>
        <p>Create, edit, and organize learning concepts for different technologies.</p>
      </header>

      <mat-tab-group>
        <mat-tab label="HTML">
          <div class="tab-content">
            <button mat-raised-button color="primary" (click)="createConcept('html')">
              <mat-icon>add</mat-icon>
              Create New HTML Concept
            </button>

            <mat-list>
              <mat-list-item *ngFor="let concept of htmlConcepts">
                <div class="concept-item">
                  <div class="concept-info">
                    <h3>{{ concept.title }}</h3>
                    <p>{{ concept.description }}</p>
                    <mat-chip-set>
                      <mat-chip [color]="getDifficultyColor(concept.difficulty)">
                        {{ concept.difficulty | titlecase }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="concept-actions">
                    <button mat-icon-button color="primary" (click)="editConcept(concept.id)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="confirmDelete(concept)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <mat-tab label="CSS">
          <div class="tab-content">
            <button mat-raised-button color="primary" (click)="createConcept('css')">
              <mat-icon>add</mat-icon>
              Create New CSS Concept
            </button>

            <mat-list>
              <mat-list-item *ngFor="let concept of cssConcepts">
                <div class="concept-item">
                  <div class="concept-info">
                    <h3>{{ concept.title }}</h3>
                    <p>{{ concept.description }}</p>
                    <mat-chip-set>
                      <mat-chip [color]="getDifficultyColor(concept.difficulty)">
                        {{ concept.difficulty | titlecase }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="concept-actions">
                    <button mat-icon-button color="primary" (click)="editConcept(concept.id)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="confirmDelete(concept)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <mat-tab label="JavaScript">
          <div class="tab-content">
            <button mat-raised-button color="primary" (click)="createConcept('javascript')">
              <mat-icon>add</mat-icon>
              Create New JavaScript Concept
            </button>

            <mat-list>
              <mat-list-item *ngFor="let concept of jsConcepts">
                <div class="concept-item">
                  <div class="concept-info">
                    <h3>{{ concept.title }}</h3>
                    <p>{{ concept.description }}</p>
                    <mat-chip-set>
                      <mat-chip [color]="getDifficultyColor(concept.difficulty)">
                        {{ concept.difficulty | titlecase }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="concept-actions">
                    <button mat-icon-button color="primary" (click)="editConcept(concept.id)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="confirmDelete(concept)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <mat-tab label="Angular">
          <div class="tab-content">
            <button mat-raised-button color="primary" (click)="createConcept('angular')">
              <mat-icon>add</mat-icon>
              Create New Angular Concept
            </button>

            <mat-list>
              <mat-list-item *ngFor="let concept of angularConcepts">
                <div class="concept-item">
                  <div class="concept-info">
                    <h3>{{ concept.title }}</h3>
                    <p>{{ concept.description }}</p>
                    <mat-chip-set>
                      <mat-chip [color]="getDifficultyColor(concept.difficulty)">
                        {{ concept.difficulty | titlecase }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="concept-actions">
                    <button mat-icon-button color="primary" (click)="editConcept(concept.id)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="confirmDelete(concept)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .concept-list {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      header {
        text-align: center;
        margin-bottom: 2rem;

        h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        p {
          color: #666;
          font-size: 1.1rem;
        }
      }

      .tab-content {
        padding: 1rem;

        button[mat-raised-button] {
          margin-bottom: 1rem;
        }
      }

      .concept-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        padding: 1rem;
        border-bottom: 1px solid #eee;

        .concept-info {
          flex: 1;

          h3 {
            margin: 0 0 0.5rem;
            color: #333;
          }

          p {
            margin: 0 0 0.5rem;
            color: #666;
          }
        }

        .concept-actions {
          display: flex;
          gap: 0.5rem;
        }
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule
  ]
})
export class ConceptListComponent implements OnInit {
  htmlConcepts: ConceptContent[] = [];
  cssConcepts: ConceptContent[] = [];
  jsConcepts: ConceptContent[] = [];
  angularConcepts: ConceptContent[] = [];

  constructor(
    private conceptService: ConceptService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadConcepts();
  }

  loadConcepts() {
    this.conceptService.getConcepts('html').subscribe(concepts => {
      this.htmlConcepts = concepts;
    });

    this.conceptService.getConcepts('css').subscribe(concepts => {
      this.cssConcepts = concepts;
    });

    this.conceptService.getConcepts('javascript').subscribe(concepts => {
      this.jsConcepts = concepts;
    });

    this.conceptService.getConcepts('angular').subscribe(concepts => {
      this.angularConcepts = concepts;
    });
  }

  createConcept(technology: string) {
    this.router.navigate(['/concept-manager/new'], { queryParams: { technology } });
  }

  editConcept(id: string) {
    this.router.navigate(['/concept-manager/edit', id]);
  }

  confirmDelete(concept: ConceptContent) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px',
      data: { title: concept.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.conceptService.deleteConcept(concept.id).subscribe(() => {
          this.loadConcepts();
        });
      }
    });
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'primary';
      case 'intermediate':
        return 'accent';
      case 'advanced':
        return 'warn';
      default:
        return 'primary';
    }
  }
}

@Component({
  selector: 'delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Delete Concept</h2>
    <mat-dialog-content>
      Are you sure you want to delete "{{ data.title }}"?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string }) {}
} 