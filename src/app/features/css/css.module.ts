import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CssListComponent } from './css-list/css-list.component';
import { CssConceptComponent } from './concept/css-concept.component';

const routes: Routes = [
  {
    path: '',
    component: CssListComponent
  },
  {
    path: 'concept/:conceptId',
    component: CssConceptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CssRoutingModule {}

@NgModule({
  imports: [
    CssRoutingModule,
    CssListComponent,
    CssConceptComponent
  ]
})
export class CssModule {}
