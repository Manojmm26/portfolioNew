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
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { highlight, highlightAll } from '../../../shared/utils/prism-config';

declare var Prism: any;

@Component({
  selector: 'app-javascript-concept',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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
                  
                  <mat-accordion class="interactive-examples" *ngIf="content.interactiveExamples">
                    <mat-expansion-panel *ngFor="let example of content.interactiveExamples; let i = index">
                      <mat-expansion-panel-header>
                        <mat-panel-title>
                          <mat-icon>code</mat-icon>
                          Interactive Example {{ i + 1 }}
                        </mat-panel-title>
                        <mat-panel-description>
                          Try it yourself!
                        </mat-panel-description>
                      </mat-expansion-panel-header>
                      
                      <div class="mini-editor">
                        <div class="code-header">
                          <span>Code:</span>
                          <button mat-icon-button (click)="tryExample(i)" matTooltip="Try this example">
                            <mat-icon>play_arrow</mat-icon>
                          </button>
                        </div>
                        <pre><code [innerHTML]="highlightCode(example.code)"></code></pre>
                        <div class="example-result" *ngIf="example.result">
                          <strong>Result:</strong>
                          <div [innerHTML]="sanitizeHtml(example.result)"></div>
                        </div>
                      </div>
                    </mat-expansion-panel>
                  </mat-accordion>

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
                      <h3>JavaScript Code</h3>
                      <div class="code-actions">
                        <button mat-icon-button (click)="copyCode()" matTooltip="Copy to clipboard">
                          <mat-icon>content_copy</mat-icon>
                        </button>
                        <button mat-icon-button (click)="resetCode()" matTooltip="Reset code">
                          <mat-icon>restart_alt</mat-icon>
                        </button>
                        <button mat-icon-button (click)="runCode()" matTooltip="Run code">
                          <mat-icon>play_arrow</mat-icon>
                        </button>
                        <button mat-icon-button 
                          [matBadge]="syntaxErrors.length" 
                          [matBadgeHidden]="!syntaxErrors.length"
                          matBadgeColor="warn"
                          [matTooltip]="syntaxErrors.length ? 'Syntax errors found' : 'No syntax errors'"
                        >
                          <mat-icon [color]="syntaxErrors.length ? 'warn' : 'primary'">
                            {{ syntaxErrors.length ? 'error' : 'check_circle' }}
                          </mat-icon>
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
                        (ngModelChange)="onCodeChange()"
                        (scroll)="syncScroll($event)"
                        rows="10"
                        spellcheck="false">
                      </textarea>
                    </div>
                    <div class="syntax-errors" *ngIf="syntaxErrors.length">
                      <div class="error" *ngFor="let error of syntaxErrors">
                        <mat-icon color="warn">error</mat-icon>
                        <span>Line {{ error.line }}: {{ error.message }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="output-section">
                    <div class="output-header">
                      <h3>Console Output</h3>
                      <button mat-icon-button (click)="clearConsole()" matTooltip="Clear console">
                        <mat-icon>clear_all</mat-icon>
                      </button>
                    </div>
                    <div class="console-output" #consoleContainer>
                      <div *ngFor="let log of consoleMessages" class="log-entry" [class]="log.type">
                        <mat-icon>{{ getLogIcon(log.type) }}</mat-icon>
                        <pre>{{ log.message }}</pre>
                      </div>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .concept-header {
      margin-bottom: 2rem;
    }

    .header-content {
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.1rem;
        line-height: 1.6;
        color: rgba(0, 0, 0, 0.7);
      }
    }

    .concept-meta {
      margin: 1rem 0;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tab-content {
      margin-top: 1rem;
    }

    .explanation-content {
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .interactive-examples {
      margin: 2rem 0;
    }

    .mini-editor {
      background: #f5f5f5;
      border-radius: 4px;
      padding: 1rem;
      margin: 1rem 0;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    pre {
      background: #1e1e1e;
      border-radius: 4px;
      padding: 1rem;
      margin: 0;
      overflow-x: auto;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .example-result {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    .key-points {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;

      h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      li {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.8rem;

        mat-icon {
          color: #4caf50;
          font-size: 20px;
          flex-shrink: 0;
        }
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

        .syntax-errors {
          padding: 1rem;
          background-color: #1e1f1c;
          border-top: 1px solid #3c3d37;

          .error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #f44336;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;

            &:last-child {
              margin-bottom: 0;
            }

            mat-icon {
              flex-shrink: 0;
            }
          }
        }
      }

      .output-section {
        border: 1px solid #e0e0e0;
        border-radius: 4px;

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

        .console-output {
          min-height: 300px;
          max-height: 500px;
          overflow-y: auto;
          padding: 1rem;
          background-color: #1e1e1e;
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          line-height: 1.5;

          .log-entry {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            color: #f8f8f2;

            &.error {
              color: #f44336;
            }

            &.warn {
              color: #ffd700;
            }

            &.info {
              color: #03a9f4;
            }

            mat-icon {
              font-size: 18px;
              flex-shrink: 0;
            }

            pre {
              margin: 0;
              white-space: pre-wrap;
              word-break: break-word;
              flex: 1;
            }
          }
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
        background-color: #f5f5f5;

        p {
          margin: 0;
          
          &.correct {
            color: #4caf50;
            font-weight: 500;
          }

          &.incorrect {
            color: #f44336;
            font-weight: 500;
          }

          &.explanation {
            margin-top: 0.5rem;
            color: #666;
          }
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

    mat-chip {
      &.beginner { background-color: #4CAF50; color: white; }
      &.intermediate { background-color: #FF9800; color: white; }
      &.advanced { background-color: #F44336; color: white; }
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .concept-container {
        padding: 12px;
      }

      .header-content {
        h1 {
          font-size: 1.8rem;
        }

        p {
          font-size: 1rem;
        }
      }

      .concept-meta {
        justify-content: flex-start;
      }

      .explanation-content {
        font-size: 1rem;
      }

      mat-expansion-panel-header {
        padding: 0 12px;
      }

      .mini-editor {
        padding: 0.5rem;
      }

      pre {
        padding: 0.5rem;
        font-size: 0.85rem;
      }

      .key-points {
        padding: 1rem;

        li {
          gap: 0.3rem;
          margin-bottom: 0.6rem;
          font-size: 0.95rem;
        }
      }

      .example-container {
        grid-template-columns: 1fr;
        gap: 1rem;

        .code-section {
          .code-header {
            padding: 0.5rem;

            h3 {
              font-size: 1rem;
            }

            .code-actions {
              gap: 0.3rem;
            }
          }

          .code-editor {
            padding: 0.5rem;

            textarea {
              font-size: 0.85rem;
              min-height: 200px;
            }

            .line-numbers {
              .line-number {
                font-size: 0.85rem;
              }
            }
          }
        }

        .output-section {
          .output-header {
            padding: 0.5rem;

            h3 {
              font-size: 1rem;
            }
          }

          .console-output {
            min-height: 200px;
            max-height: 300px;
            font-size: 0.85rem;
            padding: 0.5rem;

            .log-entry {
              gap: 0.3rem;
              font-size: 0.85rem;

              mat-icon {
                font-size: 16px;
              }
            }
          }
        }
      }

      .quiz-card {
        .options {
          button {
            padding: 8px;
            font-size: 0.95rem;
          }
        }

        .answer-feedback {
          padding: 0.8rem;
          font-size: 0.95rem;
        }
      }
    }

    @media (max-width: 480px) {
      .concept-container {
        padding: 8px;
      }

      .header-content {
        h1 {
          font-size: 1.5rem;
        }
      }

      .concept-meta {
        flex-direction: column;
        gap: 0.3rem;
      }

      mat-chip-set {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }

      .code-header {
        flex-wrap: wrap;
        gap: 0.5rem;

        h3 {
          font-size: 0.95rem;
        }
      }

      .quiz-header {
        h3 {
          font-size: 1.3rem;
        }

        p {
          font-size: 1.1rem;
        }
      }
    }
  `],
})
export class JavascriptConceptComponent implements OnInit {
  content: ConceptContent | null = null;
  userAnswers: number[] = [];
  currentCode: string = '';
  sanitizedExplanation: SafeHtml = '';
  quizComplete: boolean = false;
  quizScore: number = 0;
  syntaxErrors: Array<{ line: number; message: string }> = [];
  consoleMessages: Array<{ type: 'log' | 'info' | 'warn' | 'error', message: string }> = [];

  constructor(
    private route: ActivatedRoute,
    private conceptService: ConceptService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const conceptId = this.route.snapshot.paramMap.get('id');
    if (conceptId) {
      this.conceptService.getConcept(conceptId).subscribe(concept => {
        if (concept) {
          this.content = concept;
          if (concept.explanation) {
            this.sanitizedExplanation = this.sanitizer.bypassSecurityTrustHtml(
              concept.explanation.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            );
          }
          this.currentCode = concept.example || '';
          setTimeout(() => {
            highlightAll();
          });
        } else {
          console.error('Concept not found');
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

  onCodeChange(): void {
    this.checkSyntax();
  }

  checkSyntax(): void {
    this.syntaxErrors = [];
    try {
      new Function(this.currentCode);
    } catch (error: any) {
      const match = error.message.match(/line (\d+)/);
      const lineNumber = match ? parseInt(match[1], 10) : 1;
      this.syntaxErrors.push({
        line: lineNumber,
        message: error.message
      });
    }
  }

  runCode(): void {
    if (this.syntaxErrors.length > 0) {
      this.snackBar.open('Please fix syntax errors before running the code', 'Close', {
        duration: 3000
      });
      return;
    }

    // Create a safe execution environment
    const consoleProxy = {
      log: (message: any) => this.addConsoleOutput('log', message),
      info: (message: any) => this.addConsoleOutput('info', message),
      warn: (message: any) => this.addConsoleOutput('warn', message),
      error: (message: any) => this.addConsoleOutput('error', message)
    };

    try {
      // Create a new function with console proxy
      const code = `
        return (function() {
          const console = arguments[0];
          ${this.currentCode}
        })
      `;
      new Function(code)()(consoleProxy);
    } catch (error: any) {
      this.addConsoleOutput('error', error.message);
    }
  }

  addConsoleOutput(type: 'log' | 'info' | 'warn' | 'error', message: any): void {
    this.consoleMessages.push({
      type,
      message: this.formatConsoleMessage(message)
    });
  }

  formatConsoleMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2);
    }
    return String(message);
  }

  clearConsole(): void {
    this.consoleMessages = [];
  }

  getLogIcon(type: string): string {
    switch (type) {
      case 'info':
        return 'info';
      case 'warn':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'terminal';
    }
  }

  highlightCode(code: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      highlight(code, 'javascript')
    );
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  tryExample(index: number): void {
    if (this.content?.interactiveExamples) {
      const example = this.content.interactiveExamples[index];
      this.currentCode = example.code;
      this.checkSyntax();
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
      this.checkSyntax();
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