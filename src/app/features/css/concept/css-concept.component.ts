import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-okaidia.css';

declare var Prism: any;

@Component({
  selector: 'app-css-concept',
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
                        <mat-panel-description class="example-description">
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
                        <pre class="code-block"><code [innerHTML]="highlightCode(example.code)"></code></pre>
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
                        <span class="key-point-text">{{ point }}</span>
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
                      <h3>CSS Code</h3>
                      <div class="code-actions">
                        <button mat-icon-button (click)="copyCode()" matTooltip="Copy code">
                          <mat-icon>content_copy</mat-icon>
                        </button>
                        <button mat-icon-button (click)="resetCode()" matTooltip="Reset code">
                          <mat-icon>refresh</mat-icon>
                        </button>
                      </div>
                    </div>
                    <div class="code-editor">
                      <div class="line-numbers">
                        <div class="line-number" *ngFor="let num of getLineNumbers()">{{ num }}</div>
                      </div>
                      <textarea
                        [(ngModel)]="currentCode"
                        (input)="onCodeChange()"
                        (scroll)="syncScroll($event)"
                        spellcheck="false"
                        rows="20"
                        wrap="off"
                        class="code-textarea"
                        #codeTextarea
                      ></textarea>
                    </div>
                    <div class="syntax-errors" *ngIf="syntaxErrors.length > 0">
                      <div class="error" *ngFor="let error of syntaxErrors">
                        <mat-icon>error</mat-icon>
                        Line {{ error.line }}: {{ error.message }}
                      </div>
                    </div>
                  </div>
                  <div class="preview-section">
                    <div class="preview-header">
                      <h3>Preview</h3>
                      <button mat-icon-button (click)="togglePreviewMode()" [matTooltip]="previewMode === 'desktop' ? 'Switch to mobile view' : 'Switch to desktop view'">
                        <mat-icon>{{ previewMode === 'desktop' ? 'smartphone' : 'desktop_windows' }}</mat-icon>
                      </button>
                    </div>
                    <div class="preview-container" [class.mobile]="previewMode === 'mobile'" [innerHTML]="sanitizedPreview">
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
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .code-section {
        background-color: var(--theme-card-background);
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid var(--theme-border-color);
        
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

        .code-editor {
          display: flex;
          background-color: var(--theme-code-background);
          position: relative;
          min-height: 300px;
          border: 1px solid var(--theme-border-color);
          overflow: hidden;

          .line-numbers {
            display: flex;
            flex-direction: column;
            min-width: 40px;
            user-select: none;
            text-align: right;
            color: var(--theme-code-comment-color);
            padding: 0.5rem 0.5rem 0.5rem 0;
            border-right: 1px solid var(--theme-border-color);
            background-color: var(--theme-code-background);
            z-index: 1;

            .line-number {
              font-family: 'Fira Code', monospace;
              font-size: 0.9rem;
              line-height: 1.5;
              padding: 0 0.3rem;
              color: #858585;
            }
          }

          .code-textarea {
            flex: 1;
            min-height: 300px;
            background-color: var(--theme-code-background);
            color: var(--theme-code-text-color);
            border: none;
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            resize: none;
            padding: 0.5rem;
            outline: none;
            line-height: 1.5;
            white-space: pre;
            overflow-wrap: normal;
            overflow-x: auto;
            tab-size: 2;

            &:focus {
              outline: 1px solid var(--theme-primary-color);
            }
          }
        }

        .syntax-errors {
          padding: 0.75rem;
          background-color: var(--theme-code-background);
          border-top: 1px solid var(--theme-border-color);
          max-height: 100px;
          overflow-y: auto;

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

            mat-icon {
              font-size: 18px;
              height: 18px;
              width: 18px;
              line-height: 18px;
            }
          }
        }
      }

      .preview-section {
        border: 1px solid var(--theme-border-color);
        border-radius: 4px;

        .preview-header {
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

        .preview-container {
          min-height: 300px;
          padding: 1rem;
          background-color: var(--theme-card-background);
          overflow: auto;

          &.mobile {
            max-width: 375px;
            margin: 0 auto;
            border: 10px solid var(--theme-border-color);
            border-radius: 20px;
            min-height: 600px;
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

    .quiz-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      
      p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }
    }
    
    .correct {
      color: var(--theme-success-color);
      font-weight: bold;
    }
    
    .incorrect {
      color: var(--theme-error-color);
      font-weight: bold;
    }
    
    .explanation {
      margin-top: 0.5rem;
      font-style: italic;
    }
  `],
    encapsulation: ViewEncapsulation.None,
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
    ]
})
export class CssConceptComponent implements OnInit, AfterViewInit {
  content: ConceptContent | null = null;
  userAnswers: number[] = [];
  currentCode: string = '';
  previewHtml: SafeHtml = '';
  sanitizedExplanation: SafeHtml = '';
  sanitizedPreview: SafeHtml = '';
  previewMode: 'desktop' | 'mobile' = 'desktop';
  quizComplete: boolean = false;
  quizScore: number = 0;
  syntaxErrors: Array<{ line: number; message: string }> = [];

  @ViewChild('codeTextarea') codeTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private route: ActivatedRoute,
    private conceptService: ConceptService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const conceptId = this.route.snapshot.paramMap.get('conceptId');
    if (conceptId) {
      this.conceptService.getConcept(conceptId).subscribe(content => {
        if (content) {
          this.content = content;
          this.currentCode = content.example;
          
          // Sanitize the preview HTML
          this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(
            content.previewHtml || ''
          );

          this.sanitizedExplanation = this.sanitizer.bypassSecurityTrustHtml(
            content.explanation.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          );
          
          // Initial sanitization without CSS
          this.sanitizedPreview = this.sanitizer.bypassSecurityTrustHtml(
            content.previewHtml || ''
          );
          
          this.checkSyntax();
          
          // Apply CSS to the preview
          this.updatePreviewStyles();
        }
      });
    }
  }

  ngAfterViewInit() {
    this.updatePreviewStyles();
    
    // Set initial focus and adjust textarea height if needed
    setTimeout(() => {
      if (this.codeTextarea && this.codeTextarea.nativeElement) {
        // Adjust the height of the textarea to match content
        this.adjustTextareaHeight();
      }
    });
  }
  
  // Helper method to adjust textarea height based on content
  private adjustTextareaHeight(): void {
    if (this.codeTextarea && this.codeTextarea.nativeElement) {
      const textarea = this.codeTextarea.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(300, textarea.scrollHeight) + 'px';
    }
  }

  private updatePreviewStyles() {
    // Create a combined HTML with the CSS applied
    if (this.currentCode) {
      // Create HTML with embedded style
      const htmlWithStyle = `
        <style>
          ${this.currentCode}
        </style>
        ${this.content?.previewHtml || ''}
      `;
      
      // Update the sanitized preview with the new HTML that includes the CSS
      this.sanitizedPreview = this.sanitizer.bypassSecurityTrustHtml(htmlWithStyle);
    }
  }

  onCodeChange(): void {
    this.checkSyntax();
    this.updatePreviewStyles();
  }

  private getBaseStyles(): string {
    return ` 
      .preview-content {
        padding: 1rem;
      }
      .preview-target {
        font-family: Arial, sans-serif;
      }
      .preview-target h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      .preview-target p {
        margin-bottom: 1rem;
        line-height: 1.5;
      }
      .preview-target button {
        padding: 0.5rem 1rem;
        margin-bottom: 1rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        background: #fff;
        cursor: pointer;
      }
      .preview-target .box {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
        margin: 1rem 0;
      }
      ${this.currentCode}
    `;
  }

  getLineNumbers(): number[] {
    const lines = this.currentCode.split('\n').length;
    const minLines = 25; // Ensure we have at least 25 line numbers
    const numLines = Math.max(lines, minLines);
    return Array.from({ length: numLines }, (_, i) => i + 1);
  }

  syncScroll(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lineNumbers = textarea.previousElementSibling as HTMLElement;
    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  }

  private checkSyntax(): void {
    this.syntaxErrors = [];
    try {
      const styleElement = document.createElement('style');
      styleElement.textContent = this.currentCode;
      
      document.head.appendChild(styleElement);
      document.head.removeChild(styleElement);
    } catch (error: any) {
      this.syntaxErrors.push({
        line: 1,
        message: error.toString()
      });
    }
  }

  highlightCode(code: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      Prism.highlight(code, Prism.languages.css, 'css')
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

  togglePreviewMode(): void {
    this.previewMode = this.previewMode === 'desktop' ? 'mobile' : 'desktop';
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
    if (!this.content || !this.content.quiz || this.content.quiz.length === 0) {
      return false;
    }
    
    // Check if we have an answer for each question
    return this.content.quiz.every((_, index) => this.userAnswers[index] !== undefined);
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

    if (!this.content) return null;
    if (this.content.quiz[questionIndex].correctAnswer === optionIndex) {
      return 'primary';
    }

    if (this.userAnswers[questionIndex] === optionIndex) {
      return 'warn';
    }

    return null;
  }
}

class CSSParser {
  parse(css: string): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    
    try {
      document.head.appendChild(styleElement);
      // If we get here, the CSS is valid
      document.head.removeChild(styleElement);
    } catch (error) {
      document.head.removeChild(styleElement);
      throw error;
    }
  }
} 