import 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-okaidia.css';

declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }
}

export interface PrismLanguages {
  typescript: any;
  javascript: any;
  css: any;
  markup: any;
  [key: string]: any;
}

export function highlight(code: string, language: string): string {
  try {
    if (typeof window !== 'undefined' && window.Prism) {
      return window.Prism.highlight(
        code,
        window.Prism.languages[language],
        language
      );
    }
    return code;
  } catch (error) {
    console.warn('Prism highlight failed:', error);
    return code;
  }
}

export function highlightAll() {
  try {
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
  } catch (error) {
    console.warn('Prism highlight failed:', error);
  }
}

export function initializePrism() {
  try {
    if (typeof window !== 'undefined') {
      // Wait for Prism to be available
      const checkPrism = () => {
        if (window.Prism) {
          window.Prism.manual = true;
          console.log('Prism initialized successfully');
        } else {
          console.warn('Prism not available yet, retrying...');
          setTimeout(checkPrism, 100);
        }
      };
      checkPrism();
    }
  } catch (error) {
    console.warn('Failed to initialize Prism:', error);
  }
}
