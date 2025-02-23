import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavascriptListComponent } from './javascript-list/javascript-list.component';
import { JavascriptConceptComponent } from './concept/javascript-concept.component';

const routes: Routes = [
  {
    path: '',
    component: JavascriptListComponent
  },
  {
    path: 'concept/:conceptId',
    component: JavascriptConceptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavascriptRoutingModule {}

@NgModule({
  imports: [
    JavascriptRoutingModule,
    JavascriptListComponent,
    JavascriptConceptComponent
  ]
})
export class JavascriptModule {}
