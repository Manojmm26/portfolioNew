import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService, ThemeName } from './core/theme/theme.service';
import { ThemeSwitcherComponent } from './core/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    ThemeSwitcherComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'frontend-learning-repo';
  @HostBinding('class') themeClass = '';
  availableThemes: { name: ThemeName, displayName: string }[] = [];

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeClass = theme;
    });
    this.availableThemes = this.themeService.getAvailableThemes();
  }

  toggleTheme(): void {
    const currentTheme = this.themeService.getTheme();
    const themes = this.themeService.getAvailableThemes().map(t => t.name);
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.themeService.setTheme(themes[nextIndex]);
  }

  setTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }

  getThemeIcon(themeName: ThemeName): string {
    switch (themeName) {
      case 'light-theme':
        return 'light_mode';
      case 'dark-theme':
        return 'dark_mode';
      case 'nature-theme':
        return 'forest';
      case 'ocean-theme':
        return 'water';
      default:
        return 'settings';
    }
  }
}
