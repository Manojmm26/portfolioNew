import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularConceptsService, AngularConcept } from '../services/angular-concepts.service';
import 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css';

declare var Prism: any;

@Component({
  selector: 'app-angular-concept',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  template: `
    <div class="concept-container" *ngIf="content">
      <header class="concept-header">
        <div class="header-content">
          <h1>{{ content.title }}</h1>
          <div class="concept-meta">
            <mat-chip-set>
              <mat-chip [class]="content.difficulty">
                <mat-icon>{{ getDifficultyIcon(content.difficulty) }}</mat-icon>
                {{ content.difficulty | titlecase }}
              </mat-chip>
              <mat-chip>
                <mat-icon>{{ getCategoryIcon(content.category) }}</mat-icon>
                {{ content.category | titlecase }}
              </mat-chip>
            </mat-chip-set>
          </div>
          <p>{{ content.description }}</p>
        </div>
      </header>

      <mat-tab-group>
        <mat-tab label="Explanation">
          <div class="tab-content">
            <mat-card>
              <mat-card-content>
                <div class="explanation-content">
                  <div [innerHTML]="sanitizedExplanation"></div>
                  
                  <div class="key-points" *ngIf="content.keyPoints">
                    <h3>
                      <mat-icon>lightbulb</mat-icon>
                      Key Points
                    </h3>
                    <ul>
                      <li *ngFor="let point of content.keyPoints">
                        <mat-icon>check_circle</mat-icon>
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Example">
          <div class="tab-content">
            <mat-card>
              <mat-card-content>
                <div class="example-container">
                  <div class="code-section">
                    <div class="code-header">
                      <h3>Angular Code</h3>
                      <div class="code-actions">
                        <button mat-icon-button (click)="copyCode()" matTooltip="Copy to clipboard">
                          <mat-icon>content_copy</mat-icon>
                        </button>
                        <button mat-icon-button (click)="resetCode()" matTooltip="Reset code">
                          <mat-icon>restart_alt</mat-icon>
                        </button>
                      </div>
                    </div>
                    <div class="code-editor">
                      <div class="line-numbers">
                        <div class="line-number" *ngFor="let line of getLineNumbers()">{{ line }}</div>
                      </div>
                      <textarea
                        #codeEditor
                        [(ngModel)]="currentCode"
                        (scroll)="syncScroll($event)"
                        rows="10"
                        spellcheck="false">
                      </textarea>
                    </div>
                  </div>
                  <div class="output-section">
                    <div class="output-header">
                      <h3>Preview</h3>
                      <button mat-icon-button (click)="clearPreview()" matTooltip="Clear preview">
                        <mat-icon>clear_all</mat-icon>
                      </button>
                    </div>
                    <div class="preview-output" [innerHTML]="previewContent">
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Quiz">
          <div class="tab-content">
            <div class="quiz-header" *ngIf="quizComplete">
              <h3>Quiz Results</h3>
              <p>Score: {{ quizScore }}%</p>
              <button mat-button color="primary" (click)="resetQuiz()">Retake Quiz</button>
            </div>
            <mat-card *ngFor="let question of content.quiz; let i = index" class="quiz-card">
              <mat-card-content>
                <h3>Question {{ i + 1 }}</h3>
                <p>{{ question.question }}</p>
                <div class="options">
                  <button mat-button *ngFor="let option of question.options; let j = index"
                          (click)="checkAnswer(i, j)"
                          [disabled]="quizComplete"
                          [color]="getAnswerColor(i, j)">
                    {{ option }}
                  </button>
                </div>
                <div class="answer-feedback" *ngIf="userAnswers[i] !== undefined">
                  <p [class]="isAnswerCorrect(i) ? 'correct' : 'incorrect'">
                    {{ isAnswerCorrect(i) ? '✓ Correct!' : '✗ Incorrect' }}
                  </p>
                  <p *ngIf="!isAnswerCorrect(i)" class="explanation">
                    The correct answer is: {{ content.quiz[i].options[content.quiz[i].correctAnswer] }}
                  </p>
                </div>
              </mat-card-content>
            </mat-card>
            <div class="quiz-actions" *ngIf="!quizComplete && allQuestionsAnswered">
              <button mat-raised-button color="primary" (click)="completeQuiz()">
                Submit Quiz
              </button>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .concept-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;

      .concept-header {
        text-align: center;
        margin-bottom: 2rem;

        .header-content {
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          color: #666;
        }

        .concept-meta {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
      }

      .explanation-content {
        .key-points {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #e3f2fd;
          border-radius: 4px;

          h3 {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #1976d2;
            margin-top: 0;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-bottom: 0.5rem;

              mat-icon {
                color: #4CAF50;
                font-size: 1.2rem;
              }
            }
          }
        }
      }

      .tab-content {
        padding: 2rem 0;

        pre {
          margin: 0;
          border-radius: 4px;
        }

        code {
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
        }
      }

      .example-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;

        .code-section {
          background-color: #272822;
          border-radius: 4px;
          
          .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            background-color: #1e1f1c;
            border-radius: 4px 4px 0 0;

            h3 {
              color: #f8f8f2;
              margin: 0;
            }

            .code-actions {
              display: flex;
              gap: 0.5rem;
            }

            button {
              color: #f8f8f2;
            }
          }

          .code-editor {
            padding: 1rem;
            display: flex;
            gap: 1rem;

            .line-numbers {
              user-select: none;
              text-align: right;
              color: #75715e;
              padding-right: 0.5rem;
              border-right: 1px solid #3c3d37;

              .line-number {
                font-family: 'Fira Code', monospace;
                font-size: 0.9rem;
                line-height: 1.5;
              }
            }

            textarea {
              flex: 1;
              min-height: 300px;
              background-color: #272822;
              color: #f8f8f2;
              border: none;
              font-family: 'Fira Code', monospace;
              font-size: 0.9rem;
              resize: vertical;
              padding: 0 0.5rem;
              outline: none;
              line-height: 1.5;

              &:focus {
                outline: 1px solid #525252;
              }
            }
          }
        }

        .output-section {
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          display: flex;
          flex-direction: column;

          .output-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid #e0e0e0;

            h3 {
              margin: 0;
              color: #333;
            }
          }

          .preview-output {
            flex: 1;
            min-height: 300px;
            padding: 1rem;
            background-color: #ffffff;
            overflow-y: auto;
          }
        }
      }

      .quiz-card {
        margin-bottom: 1rem;

        .options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .answer-feedback {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 4px;

          .correct {
            color: #4CAF50;
            font-weight: bold;
          }

          .incorrect {
            color: #F44336;
            font-weight: bold;
          }

          .explanation {
            margin-top: 0.5rem;
            color: #666;
          }
        }
      }

      .quiz-header {
        text-align: center;
        margin-bottom: 2rem;

        h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1rem;
        }
      }

      .quiz-actions {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
      }

      mat-chip {
        &.beginner { background-color: #4CAF50; color: white; }
        &.intermediate { background-color: #FF9800; color: white; }
        &.advanced { background-color: #F44336; color: white; }
      }
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AngularConceptComponent implements OnInit {
  content: AngularConcept | null = null;
  currentCode: string = '';
  sanitizedExplanation: SafeHtml = '';
  previewContent: SafeHtml = '';
  userAnswers: number[] = [];
  quizComplete: boolean = false;
  quizScore: number = 0;

  constructor(
    private route: ActivatedRoute,
    private conceptsService: AngularConceptsService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const conceptId = this.route.snapshot.paramMap.get('conceptId');
    if (conceptId) {
      this.conceptsService.getConcepts().subscribe(response => {
        this.content = response.concepts.find(c => c.id === conceptId) || null;
        if (this.content) {
          this.currentCode = this.content.example;
          this.sanitizedExplanation = this.sanitizer.bypassSecurityTrustHtml(
            this.content.explanation.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          );
          this.updatePreview();
        }
      });
    }
  }

  getLineNumbers(): number[] {
    if (!this.currentCode) return [1];
    const lines = this.currentCode.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }

  syncScroll(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lineNumbers = textarea.previousElementSibling as HTMLElement;
    lineNumbers.scrollTop = textarea.scrollTop;
  }

  updatePreview(): void {
    if (this.content) {
      this.previewContent = this.sanitizer.bypassSecurityTrustHtml(
        Prism.highlight(this.currentCode, Prism.languages.typescript, 'typescript')
      );
    }
  }

  clearPreview(): void {
    this.previewContent = '';
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'fundamentals':
        return 'school';
      case 'architecture':
        return 'architecture';
      default:
        return 'help';
    }
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

  copyCode(): void {
    navigator.clipboard.writeText(this.currentCode);
    this.snackBar.open('Code copied to clipboard!', 'Close', {
      duration: 2000,
    });
  }

  resetCode(): void {
    if (this.content) {
      this.currentCode = this.content.example;
      this.updatePreview();
    }
  }

  checkAnswer(questionIndex: number, selectedAnswer: number): void {
    if (!this.quizComplete) {
      this.userAnswers[questionIndex] = selectedAnswer;
    }
  }

  isAnswerCorrect(questionIndex: number): boolean {
    if (!this.content) return false;
    return this.content.quiz[questionIndex].correctAnswer === this.userAnswers[questionIndex];
  }

  get allQuestionsAnswered(): boolean {
    return this.content ? this.userAnswers.length === this.content.quiz.length : false;
  }

  completeQuiz(): void {
    this.quizComplete = true;
    this.calculateQuizScore();
  }

  resetQuiz(): void {
    this.userAnswers = [];
    this.quizComplete = false;
    this.quizScore = 0;
  }

  calculateQuizScore(): void {
    if (!this.content) return;
    
    const correctAnswers = this.userAnswers.reduce((acc, answer, index) => {
      return acc + (this.isAnswerCorrect(index) ? 1 : 0);
    }, 0);
    
    this.quizScore = Math.round((correctAnswers / this.content.quiz.length) * 100);
  }

  getAnswerColor(questionIndex: number, optionIndex: number): string | null {
    if (this.userAnswers[questionIndex] === undefined) {
      return null;
    }

    if (this.content && this.content.quiz[questionIndex].correctAnswer === optionIndex) {
      return 'primary';
    }

    if (this.userAnswers[questionIndex] === optionIndex) {
      return 'warn';
    }

    return null;
  }
} 