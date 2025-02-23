import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularConceptsListComponent } from './angular-concepts-list/angular-concepts-list.component';
import { AngularConceptComponent } from './concept/angular-concept.component';

const routes: Routes = [
  {
    path: '',
    component: AngularConceptsListComponent
  },
  {
    path: ':conceptId',
    component: AngularConceptComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AngularConceptsListComponent,
    AngularConceptComponent
  ],
  exports: [RouterModule]
})
export class AngularConceptsModule { }
