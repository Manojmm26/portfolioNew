import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService, ThemeName } from '../../theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class ThemeSwitcherComponent implements OnInit {
  
  constructor(private themeService: ThemeService) { }

  currentTheme: ThemeName = 'light-theme';
  availableThemes: { name: ThemeName, displayName: string }[] = [];
  
  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
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
