import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, concat, first, defaultIfEmpty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CandlestickData } from 'lightweight-charts';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface InteractiveExample {
  title?: string;
  code?: string;
  result?: string;
  chartData?: CandlestickData[];
}

export interface IndicatorData {
  time: string;
  value: number;
}

export interface ChartIndicator {
  type: 'sma' | 'ema' | 'volume' | string;
  data: IndicatorData[];
  color?: string;
  lineWidth?: number;
}

export interface ConceptContent {
  id: string;
  technology: string;
  category: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  example: string;
  previewHtml?: string;
  practice: string[];
  quiz: QuizQuestion[];
  interactiveExamples: InteractiveExample[];
  keyPoints: string[];
  chartData?: CandlestickData[];
  indicators?: ChartIndicator[];
}

interface ConceptsData {
  concepts: ConceptContent[];
}

@Injectable({
  providedIn: 'root'
})
export class ConceptService {
  private predefinedConcepts: ConceptContent[] = [];
  private userConcepts: ConceptContent[] = [];
  private technicalAnalysisConceptsUrl = 'assets/data/technical-analysis-concepts.json';

  constructor(private http: HttpClient) {
    // Load user-created concepts from localStorage
    const savedConcepts = localStorage.getItem('user_concepts');
    if (savedConcepts) {
      this.userConcepts = JSON.parse(savedConcepts);
    }
  }

  private getConceptsJsonPath(technology: string): string {
    return `assets/data/${technology}-concepts.json`;
  }

  private saveUserConcepts(): void {
    localStorage.setItem('user_concepts', JSON.stringify(this.userConcepts));
  }

  getConcepts(technology: string): Observable<ConceptContent[]> {
    return this.http.get<ConceptsData>(this.getConceptsJsonPath(technology)).pipe(
      map(data => {
        const allConcepts = [
          ...data.concepts,
          ...this.userConcepts.filter(c => c.technology === technology)
        ];
        return allConcepts;
      })
    );
  }

  getTechnicalAnalysisConcepts(): Observable<ConceptContent[]> {
    return this.http.get<ConceptsData>(this.technicalAnalysisConceptsUrl).pipe(
      map(data => data.concepts),
      catchError(error => {
        console.error('Error fetching technical analysis concepts:', error);
        return of([]);
      })
    );
  }

  getTechnicalAnalysisConceptById(id: string): Observable<ConceptContent | undefined> {
    return this.http.get<ConceptsData>(this.technicalAnalysisConceptsUrl).pipe(
      map(data => data.concepts.find(concept => concept.id === id)),
      catchError(error => {
        console.error(`Error fetching technical analysis concept with id ${id}:`, error);
        return of(undefined);
      })
    );
  }

  getConcept(id: string): Observable<ConceptContent | undefined> {
    // First try to find in user concepts
    const userConcept = this.userConcepts.find(c => c.id === id);
    if (userConcept) {
      return of(userConcept);
    }

    // If not found in user concepts, try all technology files
    const technologies = ['html', 'css', 'javascript', 'angular','java'];
    
    return concat(...technologies.map(tech => 
      this.http.get<ConceptsData>(this.getConceptsJsonPath(tech)).pipe(
        map(data => data.concepts.find(c => c.id === id)),
        catchError(() => of(undefined))
      )
    )).pipe(
      first(concept => !!concept),
      defaultIfEmpty(undefined)
    );
  }

  createConcept(concept: Omit<ConceptContent, 'id'>): Observable<ConceptContent> {
    const newConcept: ConceptContent = {
      ...concept,
      id: Date.now().toString() // Simple ID generation
    };
    
    this.userConcepts.push(newConcept);
    this.saveUserConcepts();
    return of(newConcept);
  }

  updateConcept(id: string, concept: Partial<ConceptContent>): Observable<ConceptContent | undefined> {
    // Only allow updating user-created concepts
    const index = this.userConcepts.findIndex(c => c.id === id);
    if (index === -1) {
      return of(undefined);
    }

    this.userConcepts[index] = {
      ...this.userConcepts[index],
      ...concept
    };
    
    this.saveUserConcepts();
    return of(this.userConcepts[index]);
  }

  deleteConcept(id: string): Observable<boolean> {
    // Only allow deleting user-created concepts
    const index = this.userConcepts.findIndex(c => c.id === id);
    if (index === -1) {
      return of(false);
    }

    this.userConcepts.splice(index, 1);
    this.saveUserConcepts();
    return of(true);
  }
} 