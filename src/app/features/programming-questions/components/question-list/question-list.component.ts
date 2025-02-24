import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { ProgrammingQuestion } from '../../models/programming-question.model';
import { ProgrammingQuestionsService } from '../../services/programming-questions.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ]
})
export class QuestionListComponent implements OnInit {
  questions: ProgrammingQuestion[] = [];
  filteredQuestions: ProgrammingQuestion[] = [];
  categories: string[] = [];
  difficulties: string[] = [];
  
  categoryFilter = new FormControl('');
  difficultyFilter = new FormControl('');

  constructor(private programmingQuestionsService: ProgrammingQuestionsService) {}

  ngOnInit() {
    this.loadQuestions();

    // Subscribe to filter changes
    this.categoryFilter.valueChanges.subscribe(() => this.filterQuestions());
    this.difficultyFilter.valueChanges.subscribe(() => this.filterQuestions());
  }

  loadQuestions() {
    this.programmingQuestionsService.getQuestions().subscribe(questions => {
      this.questions = questions;
      this.filteredQuestions = questions;
      this.categories = [...new Set(questions.map(q => q.category))];
      this.difficulties = [...new Set(questions.map(q => q.difficulty))];
    });
  }

  filterQuestions() {
    this.filteredQuestions = this.questions.filter(question => {
      const matchesCategory = !this.categoryFilter.value || question.category === this.categoryFilter.value;
      const matchesDifficulty = !this.difficultyFilter.value || question.difficulty === this.difficultyFilter.value;
      return matchesCategory && matchesDifficulty;
    });
  }

  resetFilters() {
    this.categoryFilter.setValue('');
    this.difficultyFilter.setValue('');
    this.filteredQuestions = this.questions;
  }
}
