// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeName = 'light-theme' | 'dark-theme' | 'nature-theme' | 'ocean-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _theme: BehaviorSubject<ThemeName> = new BehaviorSubject<ThemeName>('light-theme');
  public theme$ = this._theme.asObservable();

  private readonly THEME_KEY = 'app-theme';

  constructor() { 
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeName;
    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      // Check for user's preferred color scheme
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDarkMode ? 'dark-theme' : 'light-theme');
    }
  }

  setTheme(themeName: ThemeName): void {
    if (this.isValidTheme(themeName)) {
      document.body.className = themeName;
      localStorage.setItem(this.THEME_KEY, themeName);
      this._theme.next(themeName);
    }
  }

  getTheme(): ThemeName {
    return this._theme.value;
  }

  getAvailableThemes(): { name: ThemeName, displayName: string }[] {
    return [
      { name: 'light-theme', displayName: 'Light' },
      { name: 'dark-theme', displayName: 'Dark' },
      { name: 'nature-theme', displayName: 'Nature' },
      { name: 'ocean-theme', displayName: 'Ocean' }
    ];
  }

  private isValidTheme(theme: string): theme is ThemeName {
    return ['light-theme', 'dark-theme', 'nature-theme', 'ocean-theme'].includes(theme);
  }
}
