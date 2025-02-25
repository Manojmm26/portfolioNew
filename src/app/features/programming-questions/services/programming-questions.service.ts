import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgrammingQuestion } from '../models/programming-question.model';

@Injectable({
  providedIn: 'root'
})
export class ProgrammingQuestionsService {
  private questionsUrl = 'assets/data/programming-questions.json';

  constructor(private http: HttpClient) {}

  private transformQuestion(question: any): ProgrammingQuestion {
    // Transform old format to new format if needed
    if ('solution' in question && !('solutions' in question)) {
      return {
        ...question,
        solutions: [{
          approach: question.methodology.approach,
          code: question.solution.code,
          explanation: question.solution.explanation
        }],
        solution: undefined
      };
    }
    return question;
  }

  getQuestions(): Observable<ProgrammingQuestion[]> {
    return this.http.get<{ questions: any[] }>(this.questionsUrl)
      .pipe(
        map(response => response.questions.map(q => this.transformQuestion(q)))
      );
  }

  getQuestionById(id: string): Observable<ProgrammingQuestion> {
    return this.getQuestions().pipe(
      map(questions => {
        const question = questions.find(q => q.id === id);
        if (!question) {
          throw new Error(`Question with id ${id} not found`);
        }
        return question;
      })
    );
  }

  getQuestionsByCategory(category: string): Observable<ProgrammingQuestion[]> {
    return this.getQuestions().pipe(
      map(questions => questions.filter(q => q.category === category))
    );
  }

  getQuestionsByDifficulty(difficulty: string): Observable<ProgrammingQuestion[]> {
    return this.getQuestions().pipe(
      map(questions => questions.filter(q => q.difficulty === difficulty))
    );
  }
}
