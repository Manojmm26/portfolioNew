import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializePrism } from './app/shared/utils/prism-config';

// Initialize Prism
initializePrism();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
