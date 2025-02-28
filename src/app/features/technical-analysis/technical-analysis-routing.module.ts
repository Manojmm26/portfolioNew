import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnicalAnalysisListComponent } from './technical-analysis-list/technical-analysis-list.component';
import { TechnicalAnalysisConceptComponent } from './concept/technical-analysis-concept.component';

const routes: Routes = [
  {
    path: '',
    component: TechnicalAnalysisListComponent
  },
  {
    path: 'concept/:id',
    component: TechnicalAnalysisConceptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnicalAnalysisRoutingModule { }
