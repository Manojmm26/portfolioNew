import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import loader from '@monaco-editor/loader';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { ProgrammingQuestion } from '../../models/programming-question.model';
import { ProgrammingQuestionsService } from '../../services/programming-questions.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class QuestionDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('outputContainer') outputContainer!: ElementRef;

  question$: Observable<ProgrammingQuestion>;
  code: string = '';
  output: string = '';
  isRunning: boolean = false;
  activeTab: number = 0;
  isEditorReady: boolean = false;
  selectedSolutionIndex: number = 0;

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
    private programmingQuestionsService: ProgrammingQuestionsService
  ) {
    this.question$ = this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Question ID is required');
        }
        return id;
      }),
      switchMap(id => this.programmingQuestionsService.getQuestionById(id))
    );
  }

  ngOnInit() {
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
    });

    this.question$.subscribe(question => {
      if (question?.solutions && question.solutions.length > 0) {
        this.code = question.solutions[0].code;
      }
    });
  }

  ngAfterViewInit() {
    // Any post-view initialization if needed
  }

  onEditorInit(editor: any) {
    // Store editor instance if needed
  }

  onSolutionChange(index: number, question: ProgrammingQuestion) {
    this.selectedSolutionIndex = index;
    if (question.solutions && question.solutions[index]) {
      this.code = question.solutions[index].code;
    }
  }

  resetCode(question: ProgrammingQuestion) {
    if (question.solutions && question.solutions[this.selectedSolutionIndex]) {
      this.code = question.solutions[this.selectedSolutionIndex].code;
    }
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  runCode() {
    this.isRunning = true;
    this.output = '';

    try {
      // Capture console.log output
      const originalConsole = window.console.log;
      const logs: string[] = [];
      
      window.console.log = (...args) => {
        const output = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(output);
        this.output += output + '\n';
        
        // Update view and scroll to bottom
        setTimeout(() => {
          if (this.outputContainer) {
            const element = this.outputContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
          }
        });
      };

      // Execute the code
      const executeCode = new Function(this.code);
      executeCode();

      // Restore original console.log
      window.console.log = originalConsole;

      // If no output was generated, show a message
      if (logs.length === 0) {
        this.output = 'Code executed successfully. No output generated.\n';
      }
    } catch (error: any) {
      this.output = `Error: ${error.message}\n`;
      console.error('Code execution error:', error);
    } finally {
      this.isRunning = false;
    }
  }
}
