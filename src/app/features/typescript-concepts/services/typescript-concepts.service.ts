import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TypescriptConcept {
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


export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}
export interface TypescriptConceptsResponse {
  concepts: TypescriptConcept[];
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptConceptsService {

  constructor(private http: HttpClient) {}


  getConcepts(): Observable<TypescriptConceptsResponse> {
    return this.http.get<TypescriptConceptsResponse>('./assets/data/typescript-concepts.json');
  }

  getConcept(id: string): Observable<TypescriptConcept> {
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
