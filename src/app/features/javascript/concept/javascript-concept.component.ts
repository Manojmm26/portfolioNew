import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import loader from '@monaco-editor/loader';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';
import { highlight, highlightAll } from '../../../shared/utils/prism-config';
import { marked } from 'marked';

// Configure Monaco loader to use CDN
loader.config({ 
  paths: { 
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
  } 
});

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
    MatChipsModule,
    MatExpansionModule,
    MatTabsModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MonacoEditorModule
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
                <div class="markdown-content" [innerHTML]="sanitizedExplanation"></div>
                  
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
                    <div class="editor-container">
                      <ngx-monaco-editor
                        *ngIf="isEditorReady"
                        class="code-editor"
                        [(ngModel)]="currentCode"
                        [options]="editorOptions"
                        (onInit)="onEditorInit($event)"
                        (ngModelChange)="onCodeChange()">
                      </ngx-monaco-editor>
                      <div *ngIf="!isEditorReady" class="editor-loading">
                        <mat-icon>hourglass_empty</mat-icon>
                        <span>Loading editor...</span>
                      </div>
                    </div>
                    <div class="syntax-errors" *ngIf="syntaxErrors.length">
                      <div class="error" *ngFor="let error of syntaxErrors">
                        <mat-icon color="warn">error</mat-icon>
                        <span>Line {{ error }}: {{ error }}</span>
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
                    <div class="console-output" #consoleOutput>
                      <div *ngFor="let log of consoleMessages" class="log-entry">
                        <mat-icon>terminal</mat-icon>
                        <pre>{{ log }}</pre>
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
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background-color: var(--theme-background-color);
      color: var(--theme-text-color);
    }

    .concept-header {
      margin-bottom: 2rem;
    }

    .header-content {
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--theme-text-color);
      }

      p {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--theme-secondary-text-color);
      }
    }

    .concept-meta {
      margin: 1rem 0;
      
      .beginner {
        background-color: var(--theme-beginner-color) !important;
        color: var(--theme-beginner-text-color) !important;
      }
      
      .intermediate {
        background-color: var(--theme-intermediate-color) !important;
        color: var(--theme-intermediate-text-color) !important;
      }
      
      .advanced {
        background-color: var(--theme-advanced-color) !important;
        color: var(--theme-advanced-text-color) !important;
      }
    }

    .explanation-content {
        .markdown-content {
          line-height: 1.6;
          margin-bottom: 2rem;
          
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 500;
          }
          
          p {
            margin-bottom: 1em;
          }
          
          ul, ol {
            margin-left: 1.5em;
            margin-bottom: 1em;
          }
          
          li {
            margin-bottom: 0.5em;
          }
          
          code {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
          }
          
          pre {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
            margin-bottom: 1em;
          }
          
          strong {
            font-weight: 600;
          }
          
          blockquote {
            border-left: 4px solid #ccc;
            padding-left: 1em;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1em;
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            
            th {
              background-color: rgba(0, 0, 0, 0.05);
              text-align: left;
            }
            
            tr:nth-child(even) {
              background-color: rgba(0, 0, 0, 0.025);
            }
          }
        }
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
      background: var(--theme-card-background);
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
      background: var(--theme-code-background);
      border-radius: 4px;
      padding: 1rem;
      margin: 0;
      overflow-x: auto;
      color: var(--theme-code-text-color);
    }

    .example-result {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--theme-card-background);
      border-radius: 4px;
      border: 1px solid var(--theme-border-color);
    }

    .key-points {
      margin-top: 2rem;
      padding: 1.5rem;
      background: var(--theme-card-background);
      border-radius: 8px;
      border: 1px solid var(--theme-border-color);

      h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--theme-text-color);
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
          color: var(--theme-success-color);
          font-size: 20px;
        }
      }
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .concept-container {
        padding: 1rem;
      }

      .header-content h1 {
        font-size: 2rem;
      }
    }

    .example-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: 1rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .code-section {
        border: 1px solid var(--theme-border-color);
        border-radius: 4px;
        overflow: hidden;
        
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: var(--theme-card-header-background);
          border-bottom: 1px solid var(--theme-border-color);

          h3 {
            margin: 0;
            color: var(--theme-text-color);
          }

          .code-actions {
            display: flex;
            gap: 0.5rem;
          }
        }

        .editor-container {
          border: 1px solid var(--theme-border-color);
          border-radius: 4px;
          overflow: hidden;
          height: 300px;
          background-color: #1e1e1e;
        }

        .code-editor {
          height: 100%;
          width: 100%;
        }

        .editor-loading {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 16px;
          background: linear-gradient(45deg, #1e1e1e, #2d2d2d);
          gap: 1rem;
          
          mat-icon {
            font-size: 2rem;
            width: 2rem;
            height: 2rem;
            animation: spin 1.5s linear infinite;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        ::ng-deep {
          .monaco-editor {
            padding: 8px 0;
            .monaco-editor-background {
              background-color: #1e1e1e !important;
            }
          }
        }

        .syntax-errors {
          padding: 1rem;
          background-color: var(--theme-code-background);
          border-top: 1px solid var(--theme-border-color);

          .error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--theme-error-color);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .output-section {
        border: 1px solid var(--theme-border-color);
        border-radius: 4px;

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid var(--theme-border-color);
          background-color: var(--theme-card-header-background);

          h3 {
            margin: 0;
            color: var(--theme-text-color);
          }
        }

        .console-output {
          padding: 1rem;
          background-color: var(--theme-code-background);
          overflow: auto;
          max-height: 300px;
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--theme-code-text-color);
          
          .log-entry {
            display: flex;
            align-items: flex-start;
            margin-bottom: 0.5rem;
            
            mat-icon {
              margin-right: 0.5rem;
              font-size: 18px;
              width: 18px;
              height: 18px;
            }
            
            pre {
              margin: 0;
              white-space: pre-wrap;
              word-break: break-word;
              flex: 1;
              background: transparent;
              padding: 0;
            }
          }
        }
      }
    }

    .quiz-card {
      margin-bottom: 1rem;
      background-color: var(--theme-card-background);
      border: 1px solid var(--theme-border-color);

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
        background-color: var(--theme-card-background);
        border: 1px solid var(--theme-border-color);
      }
    }

    .quiz-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .quiz-results {
      text-align: center;
      margin-bottom: 2rem;
    }
  `]
})
export class JavascriptConceptComponent implements OnInit, AfterViewInit {
  @ViewChild('consoleOutput') consoleOutput!: ElementRef;

  content: ConceptContent | null = null;
  currentCode: string = '';
  originalCode: string = '';
  consoleMessages: string[] = [];
  isRunning: boolean = false;
  syntaxErrors: string[] = [];
  isEditorReady: boolean = false;
  editor: any;
  sanitizedExplanation: SafeHtml = '';
  userAnswers: number[] = [];
  quizComplete: boolean = false;
  quizScore: number = 0;
  
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    readOnly: false
  };

  constructor(
    private route: ActivatedRoute,
    private conceptService: ConceptService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const conceptId = this.route.snapshot.paramMap.get('conceptId');
    if (conceptId) {
      this.conceptService.getConcept(conceptId).subscribe(concept => {
        if (concept) {
          this.content = concept;
          if (concept.explanation) {            
          // Convert markdown to HTML and then sanitize
          // Use marked.parse synchronously to avoid Promise
          const htmlContent = marked.parse(concept.explanation, { async: false }) as string;
          this.sanitizedExplanation = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
          }
          this.currentCode = concept.example || '';
          this.originalCode = this.currentCode;
          setTimeout(() => {
            highlightAll();
          });
        } else {
          console.error('Concept not found');
        }
      });
    }

    // Initialize Monaco Editor
    loader.init().then(monaco => {
      this.isEditorReady = true;
      
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true
      });
    }).catch(error => {
      console.error('Failed to initialize Monaco editor:', error);
    });
  }

  ngAfterViewInit(): void {
    // Any post-view initialization if needed
  }

  onEditorInit(editor: any): void {
    this.editor = editor;
    console.log('Monaco editor initialized');
    
    // Make sure the editor is visible
    setTimeout(() => {
      if (editor) {
        editor.layout();
        editor.focus();
      }
    }, 100);
  }

  resetCode(): void {
    this.currentCode = this.originalCode;
    this.syntaxErrors = [];
    this.consoleMessages = [];
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.currentCode);
    this.snackBar.open('Code copied to clipboard!', 'Close', {
      duration: 2000,
    });
  }

  runCode(): void {
    this.isRunning = true;
    this.consoleMessages = [];
    this.syntaxErrors = [];

    try {
      // Capture console.log output
      const originalConsole = window.console.log;
      const logs: string[] = [];
      
      window.console.log = (...args) => {
        const output = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(output);
        this.consoleMessages.push(output);
        
        // Update view and scroll to bottom
        setTimeout(() => {
          if (this.consoleOutput) {
            const element = this.consoleOutput.nativeElement;
            element.scrollTop = element.scrollHeight;
          }
        });
        
        // Also call the original console.log
        originalConsole.apply(console, args);
      };

      // Execute the code
      const executeCode = new Function(this.currentCode);
      executeCode();

      // Restore original console.log
      window.console.log = originalConsole;
    } catch (error) {
      if (error instanceof Error) {
        this.syntaxErrors.push(error.message);
      }
    } finally {
      this.isRunning = false;
    }
  }

  onCodeChange(): void {
    // Check for syntax errors
    try {
      new Function(this.currentCode);
      this.syntaxErrors = [];
    } catch (error) {
      if (error instanceof Error) {
        this.syntaxErrors = [error.message];
      }
    }
  }

  tryExample(index: number): void {
    if (this.content?.interactiveExamples) {
      const example = this.content.interactiveExamples[index];
      this.currentCode = example.code || '';
    }
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'emoji_events';
      case 'intermediate':
        return 'fitness_center';
      case 'advanced':
        return 'psychology';
      default:
        return 'school';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'syntax':
        return 'code';
      case 'functions':
        return 'functions';
      case 'objects':
        return 'category';
      default:
        return 'subject';
    }
  }

  highlightCode(code: string | undefined): SafeHtml {
    if (!code) return this.sanitizer.bypassSecurityTrustHtml('');
    return this.sanitizer.bypassSecurityTrustHtml(
      highlight(code, 'javascript')
    );
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
    if (!this.quizComplete) {
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

  clearConsole(): void {
    this.consoleMessages = [];
  }
}