import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptListComponent } from './concept-list/concept-list.component';
import { ConceptEditorComponent } from './concept-editor/concept-editor.component';

const routes: Routes = [
  {
    path: '',
    component: ConceptListComponent
  },
  {
    path: 'new',
    component: ConceptEditorComponent
  },
  {
    path: 'edit/:id',
    component: ConceptEditorComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ConceptManagerModule { } 