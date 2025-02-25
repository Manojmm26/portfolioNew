import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { ThemeService } from './theme/theme.service';

@NgModule({
  imports: [
    CommonModule,
    ThemeSwitcherComponent
  ],
  exports: [
    ThemeSwitcherComponent
  ],
  providers: [
    ThemeService
  ]
})
export class CoreModule { }
