import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalAnalysisRoutingModule } from './technical-analysis-routing.module';
import { TechnicalAnalysisListComponent } from './technical-analysis-list/technical-analysis-list.component';
import { TechnicalAnalysisConceptComponent } from './concept/technical-analysis-concept.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TechnicalAnalysisRoutingModule,
    TechnicalAnalysisListComponent,
    TechnicalAnalysisConceptComponent
  ]
})
export class TechnicalAnalysisModule { }
