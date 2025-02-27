import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypescriptConceptsListComponent } from './typescript-concepts-list/typescript-concepts-list.component';
import { TypescriptConceptComponent } from './concept/typescript-concept.component';

const routes: Routes = [
  {
    path: '',
    component: TypescriptConceptsListComponent
  },
  {
    path: ':conceptId',
    component: TypescriptConceptComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TypescriptConceptsListComponent,
    TypescriptConceptComponent
  ],
  exports: [RouterModule]
})
export class TypescriptConceptsModule { }
