import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface AngularConcept {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  explanation: string;
  example: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
}

export interface AngularConceptsResponse {
  concepts: AngularConcept[];
}

@Injectable({
  providedIn: 'root'
})
export class AngularConceptsService {
  constructor(private http: HttpClient) {}

  getConcepts(): Observable<AngularConceptsResponse> {
    return this.http.get<AngularConceptsResponse>('./assets/data/angular-concepts.json');
  }

  getConcept(id: string): Observable<AngularConcept> {
    return new Observable(observer => {
      this.getConcepts().subscribe({
        next: (response) => {
          const concept = response.concepts.find(c => c.id === id);
          if (concept) {
            observer.next(concept);
          } else {
            observer.error('Concept not found');
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
} 