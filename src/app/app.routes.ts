import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'html',
    loadChildren: () => import('./features/html/html.module').then(m => m.HtmlModule)
  },
  {
    path: 'css',
    loadChildren: () => import('./features/css/css.module').then(m => m.CssModule)
  },
  {
    path: 'javascript',
    loadChildren: () => import('./features/javascript/javascript.module').then(m => m.JavascriptModule)
  },
  {
    path: 'angular-concepts',
    loadChildren: () => import('./features/angular-concepts/angular-concepts.module').then(m => m.AngularConceptsModule)
  },
  {
    path: 'programming-questions',
    loadChildren: () => import('./features/programming-questions/programming-questions.module').then(m => m.ProgrammingQuestionsModule)
  },
  {
    path: 'typescript-concepts',
    loadChildren: () => import('./features/typescript-concepts/typescript-concepts.module')
      .then(m => m.TypescriptConceptsModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
