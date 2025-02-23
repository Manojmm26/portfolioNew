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
//   {
//     path: 'angular',
//     loadChildren: () => import('./features/angular/angular.module').then(m => m.AngularModule)
//   },
//   {
//     path: 'quiz',
//     loadChildren: () => import('./features/quiz/quiz.module').then(m => m.QuizModule)
//   },
  {
    path: '**',
    redirectTo: ''
  }
];
