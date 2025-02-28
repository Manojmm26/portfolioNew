import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JavaListComponent } from './java-list/java-list.component';
import { JavaConceptComponent } from './concept/java-concept.component';

const routes: Routes = [
  {
    path: '',
    component: JavaListComponent
  },
  {
    path: 'concept/:conceptId',
    component: JavaConceptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavaRoutingModule {}

@NgModule({
  imports: [
    JavaRoutingModule,
    JavaListComponent,
    JavaConceptComponent
  ]
})
export class JavaModule {}
