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
import 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-okaidia.css';
import { marked } from 'marked';

declare var Prism: any;

@Component({
  selector: 'app-html-concept',
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
                <div class="markdown-content" [innerHTML]="sanitizedExplanation"></div>

                  
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
                      <h3>HTML Code</h3>
                      <div class="code-actions">
                        <button mat-icon-button (click)="copyCode()" matTooltip="Copy to clipboard">
                          <mat-icon>content_copy</mat-icon>
                        </button>
                        <button mat-icon-button (click)="resetCode()" matTooltip="Reset code">
                          <mat-icon>restart_alt</mat-icon>
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
                        class="code-textarea"
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
                  <div class="preview-section">
                    <div class="preview-header">
                      <h3>Live Preview</h3>
                      <button mat-icon-button (click)="togglePreviewMode()" [matTooltip]="previewMode">
                        <mat-icon>{{ previewMode === 'desktop' ? 'computer' : 'smartphone' }}</mat-icon>
                      </button>
                    </div>
                    <div class="preview-container" [class]="previewMode" [innerHTML]="sanitizedPreview"></div>
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

    .code-block {
      background: var(--theme-code-background);
      border-radius: 4px;
      padding: 1rem;
      margin: 0;
      overflow-x: auto;
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
            padding-right: 0.5rem;
            border-right: 1px solid var(--theme-border-color);

            .line-number {
              font-family: 'Fira Code', monospace;
              font-size: 0.9rem;
              line-height: 1.5;
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
export class HtmlConceptComponent implements OnInit {
  content: ConceptContent | null = null;
  userAnswers: number[] = [];
  currentCode: string = '';
  sanitizedPreview: SafeHtml = '';
  sanitizedExplanation: SafeHtml = '';
  previewMode: 'desktop' | 'mobile' = 'desktop';
  quizComplete: boolean = false;
  quizScore: number = 0;
  syntaxErrors: Array<{ line: number; message: string }> = [];

  constructor(
    private route: ActivatedRoute,
    private conceptService: ConceptService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const conceptId = this.route.snapshot.paramMap.get('conceptId');
    if (conceptId) {
      this.conceptService.getConcept(conceptId).subscribe(content => {
        if (content) {
          this.content = content;
          this.currentCode = content.example;
          this.sanitizedPreview = this.sanitizer.bypassSecurityTrustHtml(content.example);
          if (content.explanation) {            
            // Convert markdown to HTML and then sanitize
            // Use marked.parse synchronously to avoid Promise
            const htmlContent = marked.parse(content.explanation, { async: false }) as string;
            this.sanitizedExplanation = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
            }
          this.checkSyntax();
        }
      });
    }
  }

  getLineNumbers(): number[] {
    const lines = this.currentCode.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }

  syncScroll(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lineNumbers = textarea.previousElementSibling as HTMLElement;
    lineNumbers.scrollTop = textarea.scrollTop;
  }

  onCodeChange(): void {
    this.updatePreview();
    this.checkSyntax();
  }

  checkSyntax(): void {
    this.syntaxErrors = [];
    const lines = this.currentCode.split('\n');
    const stack: Array<{ tag: string; line: number }> = [];
    const selfClosingTags = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);
    
    // Process all lines to find tags
    lines.forEach((line, lineIndex) => {
      let position = 0;
      
      while (position < line.length) {
        // Find next tag
        const tagStart = line.indexOf('<', position);
        if (tagStart === -1) break;
        
        const tagEnd = line.indexOf('>', tagStart);
        if (tagEnd === -1) {
          // Unclosed tag bracket
          this.syntaxErrors.push({
            line: lineIndex + 1,
            message: 'Unclosed tag bracket'
          });
          break;
        }
        
        const tagContent = line.substring(tagStart + 1, tagEnd);
        position = tagEnd + 1;
        
        // Skip comments and doctype
        if (tagContent.startsWith('!')) continue;
        
        // Check if it's a closing tag
        if (tagContent.startsWith('/')) {
          const tagName = tagContent.substring(1).trim().split(' ')[0].toLowerCase();
          
          // Find matching opening tag
          const lastTag = stack.pop();
          if (!lastTag) {
            this.syntaxErrors.push({
              line: lineIndex + 1,
              message: `Unexpected closing tag </${tagName}>`
            });
          } else if (lastTag.tag !== tagName) {
            this.syntaxErrors.push({
              line: lineIndex + 1,
              message: `Mismatched closing tag: expected </${lastTag.tag}>, found </${tagName}>`
            });
            // Put the tag back since it wasn't matched
            stack.push(lastTag);
          }
        } else {
          // It's an opening tag
          const tagName = tagContent.trim().split(' ')[0].toLowerCase();
          
          // Check for invalid tag names
          if (!tagName.match(/^[a-z][a-z0-9-]*$/)) {
            this.syntaxErrors.push({
              line: lineIndex + 1,
              message: `Invalid tag name: ${tagName}`
            });
            continue;
          }
          
          // Check for attributes
          const attributeMatches = tagContent.match(/\s\w+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/g);
          if (attributeMatches) {
            attributeMatches.forEach(attr => {
              const [name, value] = attr.trim().split('=');
              if (value && !value.match(/^["'][^"']*["']$/)) {
                this.syntaxErrors.push({
                  line: lineIndex + 1,
                  message: `Invalid attribute value for ${name}: missing quotes`
                });
              }
            });
          }
          
          // Don't push self-closing tags onto the stack
          if (!selfClosingTags.has(tagName) && !tagContent.endsWith('/')) {
            stack.push({ tag: tagName, line: lineIndex + 1 });
          }
        }
      }
    });
    
    // Check for any remaining unclosed tags
    stack.forEach(({ tag, line }) => {
      this.syntaxErrors.push({
        line,
        message: `Unclosed tag <${tag}>`
      });
    });
  }

  highlightCode(code: string | undefined): SafeHtml {
    if (!code) return this.sanitizer.bypassSecurityTrustHtml('');
    return this.sanitizer.bypassSecurityTrustHtml(
      Prism.highlight(code, Prism.languages.markup, 'markup')
    );
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  tryExample(index: number): void {
    if (this.content?.interactiveExamples) {
      const example = this.content.interactiveExamples[index];
      this.currentCode = example.code || '';
      this.updatePreview();
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
      this.updatePreview();
    }
  }

  updatePreview(): void {
    this.sanitizedPreview = this.sanitizer.bypassSecurityTrustHtml(this.currentCode);
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