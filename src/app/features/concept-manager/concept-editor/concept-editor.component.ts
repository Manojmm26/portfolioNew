import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { ConceptService, ConceptContent } from '../../../shared/services/concept.service';

@Component({
  selector: 'app-concept-editor',
  template: `
    <div class="concept-editor">
      <header>
        <h1>{{ isNewConcept ? 'Create New' : 'Edit' }} {{ technology | titlecase }} Concept</h1>
      </header>

      <form [formGroup]="conceptForm" (ngSubmit)="saveConcept()">
        <mat-card>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter concept title">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" 
                  placeholder="Enter concept description"></textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Difficulty</mat-label>
                <mat-select formControlName="difficulty">
                  <mat-option value="beginner">Beginner</mat-option>
                  <mat-option value="intermediate">Intermediate</mat-option>
                  <mat-option value="advanced">Advanced</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Explanation</mat-label>
                <textarea matInput formControlName="explanation" rows="5" 
                  placeholder="Enter detailed explanation"></textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Example Code</mat-label>
                <textarea matInput formControlName="example" rows="10" 
                  placeholder="Enter example code"></textarea>
              </mat-form-field>
            </div>

            <mat-accordion>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>Practice Exercises</mat-panel-title>
                </mat-expansion-panel-header>
                <div formArrayName="practice">
                  <div *ngFor="let exercise of practiceControls; let i = index" class="array-item">
                    <mat-form-field appearance="outline">
                      <mat-label>Exercise {{ i + 1 }}</mat-label>
                      <textarea matInput [formControlName]="i" rows="2"></textarea>
                    </mat-form-field>
                    <button mat-icon-button color="warn" type="button" (click)="removePractice(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-button color="primary" type="button" (click)="addPractice()">
                    <mat-icon>add</mat-icon>
                    Add Exercise
                  </button>
                </div>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>Quiz Questions</mat-panel-title>
                </mat-expansion-panel-header>
                <div formArrayName="quiz">
                  <div *ngFor="let question of quizControls; let i = index" class="array-item">
                    <div [formGroupName]="i">
                      <mat-form-field appearance="outline">
                        <mat-label>Question {{ i + 1 }}</mat-label>
                        <input matInput formControlName="question">
                      </mat-form-field>

                      <div formArrayName="options">
                        <div *ngFor="let option of getOptionsControls(i); let j = index" class="option-item">
                          <mat-form-field appearance="outline">
                            <mat-label>Option {{ j + 1 }}</mat-label>
                            <input matInput [formControlName]="j">
                          </mat-form-field>
                          <mat-radio-button [checked]="j === (question.get('correctAnswer')?.value ?? 0)"
                            (change)="setCorrectAnswer(i, j)">
                            Correct
                          </mat-radio-button>
                        </div>
                      </div>
                    </div>
                    <button mat-icon-button color="warn" type="button" (click)="removeQuiz(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-button color="primary" type="button" (click)="addQuiz()">
                    <mat-icon>add</mat-icon>
                    Add Question
                  </button>
                </div>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>Interactive Examples</mat-panel-title>
                </mat-expansion-panel-header>
                <div formArrayName="interactiveExamples">
                  <div *ngFor="let example of interactiveExamplesControls; let i = index" 
                    [formGroupName]="i" class="array-item">
                    <mat-form-field appearance="outline">
                      <mat-label>Example Code</mat-label>
                      <textarea matInput formControlName="code" rows="5"></textarea>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Result (optional)</mat-label>
                      <textarea matInput formControlName="result" rows="3"></textarea>
                    </mat-form-field>
                    <button mat-icon-button color="warn" type="button" (click)="removeInteractiveExample(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-button color="primary" type="button" (click)="addInteractiveExample()">
                    <mat-icon>add</mat-icon>
                    Add Interactive Example
                  </button>
                </div>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>Key Points</mat-panel-title>
                </mat-expansion-panel-header>
                <div formArrayName="keyPoints">
                  <div *ngFor="let point of keyPointsControls; let i = index" class="array-item">
                    <mat-form-field appearance="outline">
                      <mat-label>Key Point {{ i + 1 }}</mat-label>
                      <input matInput [formControlName]="i">
                    </mat-form-field>
                    <button mat-icon-button color="warn" type="button" (click)="removeKeyPoint(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-button color="primary" type="button" (click)="addKeyPoint()">
                    <mat-icon>add</mat-icon>
                    Add Key Point
                  </button>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" 
              [disabled]="conceptForm.invalid">Save</button>
          </mat-card-actions>
        </mat-card>
      </form>
    </div>
  `,
  styles: [`
    .concept-editor {
      max-width: 1000px;
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
      }

      .form-row {
        margin-bottom: 1.5rem;

        mat-form-field {
          width: 100%;
        }
      }

      .array-item {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        margin-bottom: 1rem;

        mat-form-field {
          flex: 1;
        }
      }

      .option-item {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 0.5rem;

        mat-form-field {
          flex: 1;
        }
      }

      mat-expansion-panel {
        margin-bottom: 1rem;
      }

      mat-card-actions {
        padding: 1rem;
        gap: 1rem;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatChipsModule,
    MatRadioModule
  ]
})
export class ConceptEditorComponent implements OnInit {
  conceptForm: FormGroup;
  technology: string = '';
  isNewConcept: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conceptService: ConceptService
  ) {
    this.conceptForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['beginner', Validators.required],
      explanation: ['', Validators.required],
      example: ['', Validators.required],
      practice: this.fb.array([]),
      quiz: this.fb.array([]),
      interactiveExamples: this.fb.array([]),
      keyPoints: this.fb.array([])
    });
  }

  ngOnInit() {
    // Get technology from query params
    this.route.queryParams.subscribe(params => {
      this.technology = params['technology'] || '';
    });

    // Get concept ID from route params
    const conceptId = this.route.snapshot.paramMap.get('id');
    if (conceptId) {
      this.isNewConcept = false;
      this.loadConcept(conceptId);
    }
  }

  loadConcept(conceptId: string) {
    this.conceptService.getConcept(conceptId).subscribe(concept => {
      if (concept) {
        this.conceptForm.patchValue({
          title: concept.title,
          description: concept.description,
          difficulty: concept.difficulty,
          explanation: concept.explanation,
          example: concept.example
        });

        // Reset form arrays
        const practice = this.conceptForm.get('practice') as FormArray;
        practice.clear();
        concept.practice.forEach(item => practice.push(this.fb.control(item)));

        const quiz = this.conceptForm.get('quiz') as FormArray;
        quiz.clear();
        concept.quiz.forEach(item => {
          quiz.push(this.fb.group({
            question: [item.question, Validators.required],
            options: this.fb.array(item.options.map(opt => this.fb.control(opt))),
            correctAnswer: [item.correctAnswer, Validators.required]
          }));
        });

        const examples = this.conceptForm.get('interactiveExamples') as FormArray;
        examples.clear();
        concept.interactiveExamples.forEach(item => {
          examples.push(this.fb.group({
            code: [item.code, Validators.required],
            result: [item.result || '']
          }));
        });

        const keyPoints = this.conceptForm.get('keyPoints') as FormArray;
        keyPoints.clear();
        concept.keyPoints.forEach(item => keyPoints.push(this.fb.control(item)));
      }
    });
  }

  saveConcept() {
    if (this.conceptForm.valid) {
      const conceptData = {
        technology: this.technology,
        ...this.conceptForm.value
      };

      if (this.isNewConcept) {
        this.conceptService.createConcept(conceptData).subscribe(() => {
          this.router.navigate(['/concept-manager']);
        });
      } else {
        const conceptId = this.route.snapshot.paramMap.get('conceptId');
        if (conceptId) {
          this.conceptService.updateConcept(conceptId, conceptData).subscribe(() => {
            this.router.navigate(['/concept-manager']);
          });
        }
      }
    }
  }

  cancel() {
    this.router.navigate(['/concept-manager']);
  }

  // Form array getters and methods
  get practiceControls() {
    return (this.conceptForm.get('practice') as FormArray).controls;
  }

  get quizControls() {
    return (this.conceptForm.get('quiz') as FormArray).controls;
  }

  get interactiveExamplesControls() {
    return (this.conceptForm.get('interactiveExamples') as FormArray).controls;
  }

  get keyPointsControls() {
    return (this.conceptForm.get('keyPoints') as FormArray).controls;
  }

  getOptionsControls(questionIndex: number) {
    return ((this.conceptForm.get('quiz') as FormArray)
      .at(questionIndex)
      .get('options') as FormArray).controls;
  }

  addPractice() {
    const practice = this.conceptForm.get('practice') as FormArray;
    practice.push(this.fb.control(''));
  }

  removePractice(index: number) {
    const practice = this.conceptForm.get('practice') as FormArray;
    practice.removeAt(index);
  }

  addQuiz() {
    const quiz = this.conceptForm.get('quiz') as FormArray;
    quiz.push(this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ]),
      correctAnswer: [0, Validators.required]
    }));
  }

  removeQuiz(index: number) {
    const quiz = this.conceptForm.get('quiz') as FormArray;
    quiz.removeAt(index);
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number) {
    const question = (this.conceptForm.get('quiz') as FormArray).at(questionIndex);
    question.patchValue({ correctAnswer: optionIndex });
  }

  addInteractiveExample() {
    const examples = this.conceptForm.get('interactiveExamples') as FormArray;
    examples.push(this.fb.group({
      code: ['', Validators.required],
      result: ['']
    }));
  }

  removeInteractiveExample(index: number) {
    const examples = this.conceptForm.get('interactiveExamples') as FormArray;
    examples.removeAt(index);
  }

  addKeyPoint() {
    const keyPoints = this.conceptForm.get('keyPoints') as FormArray;
    keyPoints.push(this.fb.control(''));
  }

  removeKeyPoint(index: number) {
    const keyPoints = this.conceptForm.get('keyPoints') as FormArray;
    keyPoints.removeAt(index);
  }
} 