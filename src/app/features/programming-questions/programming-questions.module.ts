import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';

import { ProgrammingQuestionsRoutingModule } from './programming-questions-routing.module';
import { ProgrammingQuestionsService } from './services/programming-questions.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    ProgrammingQuestionsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MonacoEditorModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule
  ],
  providers: [
    ProgrammingQuestionsService,
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        onMonacoLoad: () => {
          console.log('Monaco Editor has been loaded');
        }
      }
    }
  ]
})
export class ProgrammingQuestionsModule { }
