import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineWidth, CrosshairMode, LineStyle } from 'lightweight-charts';
import { ConceptService, ConceptContent, ChartIndicator, IndicatorData } from '../../../shared/services/concept.service';
import { highlight, highlightAll } from '../../../shared/utils/prism-config';

@Component({
  selector: 'app-technical-analysis-concept',
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
    MatProgressSpinnerModule
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
                  
                  <div class="chart-container" *ngIf="content.chartData">
                    <h3>
                      <mat-icon>candlestick_chart</mat-icon>
                      Candlestick Chart Example
                    </h3>
                    <div #chartContainer class="chart"></div>
                    <div class="chart-legend">
                      <div class="legend-item">
                        <div class="candle bullish"></div>
                        <span>Bullish Candle (Close > Open)</span>
                      </div>
                      <div class="legend-item">
                        <div class="candle bearish"></div>
                        <span>Bearish Candle (Close < Open)</span>
                      </div>
                    </div>
                  </div>
                  
                  <mat-accordion class="interactive-examples" *ngIf="content.interactiveExamples">
                    <mat-expansion-panel *ngFor="let example of content.interactiveExamples; let i = index">
                      <mat-expansion-panel-header>
                        <mat-panel-title>
                          <mat-icon>code</mat-icon>
                          Interactive Example {{ i + 1 }}
                        </mat-panel-title>
                        <mat-panel-description>
                          {{ example.title }}
                        </mat-panel-description>
                      </mat-expansion-panel-header>
                      
                      <div class="mini-editor">
                        <div *ngIf="example.code" class="code-section">
                          <div class="code-header">
                            <span>Code:</span>
                          </div>
                          <pre><code [innerHTML]="highlightCode(example.code)"></code></pre>
                        </div>
                        
                        <div *ngIf="example.chartData" class="chart-section">
                          <h4>Chart Visualization:</h4>
                          <div class="mini-chart" [id]="'example-chart-' + i"></div>
                        </div>
                        
                        <div class="example-result" *ngIf="example.result">
                          <strong>Result:</strong>
                          <div [innerHTML]="example.result"></div>
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

        <mat-tab label="Quiz">
          <div class="tab-content">
            <div class="quiz-results" *ngIf="quizComplete">
              <h2>Quiz Results</h2>
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
            <div class="quiz-actions" *ngIf="!quizComplete && allQuestionsAnswered()">
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

    .chart-container {
      margin: 2rem 0;
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

      .chart {
        width: 100%;
        height: 400px;
        margin-bottom: 1rem;
      }

      .chart-legend {
        display: flex;
        gap: 2rem;
        margin-top: 1rem;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .candle {
          width: 20px;
          height: 20px;
          border-radius: 3px;
        }

        .bullish {
          background-color: #26a69a;
        }

        .bearish {
          background-color: #ef5350;
        }
      }
    }

    .interactive-examples {
      margin: 2rem 0;
    }

    .mini-editor {
      background: var(--theme-card-background);
      border-radius: 4px;
      padding: 1rem;
      margin: 1rem 0;
      
      .code-section {
        margin-bottom: 1.5rem;
      }
      
      .chart-section {
        margin: 1.5rem 0;
        
        h4 {
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .mini-chart {
          width: 100%;
          height: 300px;
          border-radius: 4px;
          overflow: hidden;
        }
      }
      
      .example-result {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 4px;
        
        strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
        }
      }
      
      .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      pre {
        background: #1E222D;
        border-radius: 4px;
        padding: 1rem;
        margin: 0;
        overflow-x: auto;
        color: #D9D9D9;
      }
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
          color: var(--theme-primary-color);
          font-size: 18px;
          width: 18px;
          height: 18px;
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

        .correct {
          color: #4caf50;
          font-weight: bold;
        }

        .incorrect {
          color: #f44336;
          font-weight: bold;
        }

        .explanation {
          margin-top: 0.5rem;
        }
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
export class TechnicalAnalysisConceptComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  content: ConceptContent | null = null;
  sanitizedExplanation: SafeHtml = '';
  userAnswers: number[] = [];
  quizComplete: boolean = false;
  quizScore: number = 0;
  
  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;

  constructor(
    private route: ActivatedRoute,
    private conceptService: ConceptService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.conceptService.getTechnicalAnalysisConceptById(id).subscribe(concept => {
          if (concept) {
            this.content = concept;
        
            this.userAnswers = new Array(this.content.quiz?.length || 0).fill(undefined);
            
            // Initialize chart if chartData is available
            if (this.content.chartData && this.content.chartData.length > 0) {
              setTimeout(() => {
                this.initChart();
              }, 0);
            }
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // If there's chart data available, initialize the chart after view init
    if (this.content?.chartData && this.content.chartData.length > 0 && this.chartContainer) {
      setTimeout(() => {
        this.initChart();
      }, 0);
    }
    
    // Initialize mini-charts for interactive examples
    setTimeout(() => {
      this.initInteractiveExampleCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.remove();
    }
  }

  private initChart(): void {
    if (this.chartContainer && this.content?.chartData) {
      const chartOptions = {
        layout: {
          background: { color: '#1E1E1E' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        width: this.chartContainer.nativeElement.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            width: 1 as LineWidth,
            color: 'rgba(224, 227, 235, 0.1)',
            style: LineStyle.Solid,
          },
          horzLine: {
            width: 1 as LineWidth,
            color: 'rgba(224, 227, 235, 0.1)',
            style: LineStyle.Solid,
          },
        },
        localization: {
          priceFormatter: (price: number) => price.toFixed(2),
        },
      };

      this.chart = createChart(this.chartContainer.nativeElement, chartOptions);
      
      this.candlestickSeries = this.chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
      
      this.candlestickSeries.setData(this.content.chartData);
      
      // Add technical indicators if available
      if (this.content.indicators) {
        this.addIndicators(this.content.indicators);
      }
      
      // Handle window resize
      const resizeObserver = new ResizeObserver(() => {
        if (this.chart) {
          this.chart.applyOptions({ 
            width: this.chartContainer.nativeElement.clientWidth 
          });
        }
      });



  
      this.chart.timeScale().setVisibleLogicalRange({ from: -5, to: 10 });  
      
      // this.chart.timeScale().fitContent();
 
  
      resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }

  private addIndicators(indicators: ChartIndicator[] | undefined): void {
    if (!this.chart || !indicators || indicators.length === 0) return;
    
    indicators.forEach(indicator => {
      if (!indicator || !indicator.type || !indicator.data) return;
      
      switch (indicator.type) {
        case 'sma':
          this.addMovingAverage(indicator.data, indicator.color || '#2196F3', indicator.lineWidth || 2);
          break;
        case 'ema':
          this.addMovingAverage(indicator.data, indicator.color || '#FF9800', indicator.lineWidth || 2);
          break;
        case 'volume':
          this.addVolumeIndicator(indicator.data);
          break;
        // Add more indicator types as needed
      }
    });
  }

  private addMovingAverage(data: IndicatorData[], color: string, lineWidth: number): void {
    if (!this.chart) return;
    
    const lineSeries = this.chart.addLineSeries({
      color: color,
      lineWidth: lineWidth as LineWidth,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
    });
    
    lineSeries.setData(data);
  }

  private addVolumeIndicator(data: IndicatorData[]): void {
    if (!this.chart) return;
    
    const volumeSeries = this.chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });
    
    this.chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    volumeSeries.setData(data);
  }

  private initInteractiveExampleCharts(): void {
    
    if (!this.content?.interactiveExamples) return;

    this.content.interactiveExamples.forEach((example, index) => {
      if (example.chartData && example.chartData.length > 0) {
        const chartElement = document.getElementById(`example-chart-${index}`);
     
        if (!chartElement) return;
        
        const miniChart = createChart(chartElement, {
          layout: {
            background: { color: '#1E222D' },
            textColor: '#D9D9D9',
          },
          grid: {
            vertLines: { color: '#2B2B43' },
            horzLines: { color: '#2B2B43' },
          },
          width: chartElement.clientWidth,
          height: 300,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              width: 1 as LineWidth,
              color: 'rgba(224, 227, 235, 0.1)',
              style: LineStyle.Solid,
            },
            horzLine: {
              width: 1 as LineWidth,
              color: 'rgba(224, 227, 235, 0.1)',
              style: LineStyle.Solid,
            },
          },
        });
        
        miniChart.timeScale().setVisibleLogicalRange({ from: -9, to: 9 });  


        const candlestickSeries = miniChart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
        
        candlestickSeries.setData(example.chartData);
      }
    });
  }

  getDifficultyIcon(difficulty: string): string {
    const iconMap: {[key: string]: string} = {
      'beginner': 'school',
      'intermediate': 'trending_up',
      'advanced': 'psychology'
    };
    
    return iconMap[difficulty.toLowerCase()] || 'help';
  }

  getCategoryIcon(category: string): string {
    const iconMap: {[key: string]: string} = {
      'candlestick': 'candlestick_chart',
      'indicator': 'trending_up',
      'pattern': 'auto_graph',
      'strategy': 'insights',
      'fundamentals': 'assessment'
    };
    
    return iconMap[category.toLowerCase()] || 'subject';
  }

  highlightCode(code: string | undefined): string {
    if (!code) return '';
    return highlight(code, 'javascript');
  }

  // sanitizeHtml(html: string): SafeHtml {
  //   return this.sanitizer.bypassSecurityTrustHtml(html);
  // }

  checkAnswer(questionIndex: number, answerIndex: number): void {
    if (this.quizComplete) return;
    
    this.userAnswers[questionIndex] = answerIndex;
  }

  isAnswerCorrect(questionIndex: number): boolean {
    if (!this.content?.quiz) return false;
    
    const correctAnswer = this.content.quiz[questionIndex].correctAnswer;
    return this.userAnswers[questionIndex] === correctAnswer;
  }

  getAnswerColor(questionIndex: number, answerIndex: number): string {
    if (this.userAnswers[questionIndex] === undefined) return '';
    
    if (this.quizComplete) {
      if (this.content?.quiz && this.content.quiz[questionIndex].correctAnswer === answerIndex) {
        return 'primary';
      } else if (this.userAnswers[questionIndex] === answerIndex) {
        return 'warn';
      }
    } else if (this.userAnswers[questionIndex] === answerIndex) {
      return 'primary';
    }
    
    return '';
  }

  allQuestionsAnswered(): boolean {
    return this.userAnswers.every(answer => answer !== undefined);
  }

  completeQuiz(): void {
    if (!this.content?.quiz) return;
    
    let correctAnswers = 0;
    for (let i = 0; i < this.content.quiz.length; i++) {
      if (this.isAnswerCorrect(i)) {
        correctAnswers++;
      }
    }
    
    this.quizScore = Math.round((correctAnswers / this.content.quiz.length) * 100);
    this.quizComplete = true;
  }

  resetQuiz(): void {
    if (this.content?.quiz) {
      this.userAnswers = new Array(this.content.quiz.length).fill(undefined);
    } else {
      this.userAnswers = [];
    }
    this.quizComplete = false;
    this.quizScore = 0;
  }
}
