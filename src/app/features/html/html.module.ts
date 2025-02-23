import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HtmlListComponent } from './html-list/html-list.component';

const routes: Routes = [
  {
    path: '',
    component: HtmlListComponent
  },
  {
    path: ':conceptId',
    loadComponent: () => import('./concept/html-concept.component').then(m => m.HtmlConceptComponent)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class HtmlModule { }
