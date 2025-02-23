import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Concept {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ConceptContent {
  title: string;
  description: string;
  explanation: string;
  example: string;
  practice: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  interactiveExamples?: Array<{
    code: string;
    result?: string;
  }>;
  keyPoints?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ConceptService {
  private htmlConcepts: Record<string, ConceptContent> = {
    'div': {
      title: 'Div Element',
      description: 'Learn about the div element and how to use it for content division and layout',
      explanation: 'The <div> element is a container that helps organize and group content. It\'s a block-level element commonly used for layout and styling purposes. Unlike semantic elements, divs have no inherent meaning but serve as versatile containers for structuring content.',
      example: `<div class="container">
  <div class="header">
    <h1>Welcome</h1>
  </div>
  <div class="content">
    <p>This is the main content.</p>
  </div>
</div>`,
      practice: [
        'Create a simple layout with header, content, and footer using div elements',
        'Style different div elements with unique background colors and padding',
        'Create a card layout using nested div elements'
      ],
      difficulty: 'beginner',
      quiz: [
        {
          question: 'What is the default display property of a div element?',
          options: ['inline', 'block', 'inline-block', 'flex'],
          correctAnswer: 1
        },
        {
          question: 'Which is NOT a common use case for div elements?',
          options: [
            'Creating layouts',
            'Grouping related content',
            'Inline text formatting',
            'Container for styling'
          ],
          correctAnswer: 2
        }
      ]
    },
    'semantic-elements': {
      title: 'Semantic Elements',
      description: 'Understand semantic HTML elements like header, nav, main, article, and footer',
      explanation: 'Semantic HTML elements clearly describe their meaning to both the browser and the developer. They provide better structure, accessibility, and SEO benefits compared to generic div elements. Common semantic elements include <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer>.',
      example: `<header>
  <h1>Website Title</h1>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h2>Article Title</h2>
    <section>
      <h3>Section Heading</h3>
      <p>Content goes here...</p>
    </section>
  </article>
  <aside>
    <h3>Related Content</h3>
    <ul>
      <li>Link 1</li>
      <li>Link 2</li>
    </ul>
  </aside>
</main>
<footer>
  <p>&copy; 2024 Your Website</p>
</footer>`,
      practice: [
        'Convert a div-based layout to use semantic elements',
        'Create a blog post layout using article, section, and aside elements',
        'Build a navigation menu using the nav element and proper structure'
      ],
      difficulty: 'intermediate',
      quiz: [
        {
          question: 'Which semantic element is best suited for the main content area of a webpage?',
          options: ['<div>', '<content>', '<main>', '<section>'],
          correctAnswer: 2
        },
        {
          question: 'What is the primary benefit of using semantic elements?',
          options: [
            'They look better by default',
            'They provide meaning and improve accessibility',
            'They load faster than div elements',
            'They require less CSS'
          ],
          correctAnswer: 1
        }
      ]
    },
    'forms': {
      title: 'Forms & Input',
      description: 'Master HTML forms, input types, and form validation attributes',
      explanation: 'HTML forms are essential for collecting user input. The <form> element contains various input elements, each designed for specific types of data. Modern HTML5 input types provide built-in validation and appropriate mobile keyboards.',
      example: `<form action="/submit" method="POST">
  <div class="form-group">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required minlength="2">
  </div>
  
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div class="form-group">
    <label for="age">Age:</label>
    <input type="number" id="age" name="age" min="18" max="120">
  </div>
  
  <div class="form-group">
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4"></textarea>
  </div>
  
  <button type="submit">Submit</button>
</form>`,
      practice: [
        'Create a registration form with various input types',
        'Implement client-side validation using HTML5 attributes',
        'Style a form to be responsive and user-friendly'
      ],
      difficulty: 'intermediate',
      quiz: [
        {
          question: 'Which input type should be used for email addresses?',
          options: ['text', 'email', 'string', 'mail'],
          correctAnswer: 1
        },
        {
          question: 'What attribute makes a form field required?',
          options: ['mandatory', 'required', 'needed', 'important'],
          correctAnswer: 1
        }
      ]
    },
    'tables': {
      title: 'Tables',
      description: 'Learn table structure and advanced features like colspan and rowspan',
      explanation: 'HTML tables are used to present data in rows and columns. They consist of elements like <table>, <tr> (table row), <td> (table data), and <th> (table header). Tables can be enhanced with attributes like colspan and rowspan for complex layouts.',
      example: `<table border="1">
  <thead>
    <tr>
      <th>Header 1</th>
      <th colspan="2">Header 2 & 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">Cell 1</td>
      <td>Cell 2</td>
      <td>Cell 3</td>
    </tr>
    <tr>
      <td>Cell 4</td>
      <td>Cell 5</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Footer</td>
    </tr>
  </tfoot>
</table>`,
      practice: [
        'Create a simple data table with headers',
        'Build a complex table using colspan and rowspan',
        'Style a table to be responsive on mobile devices'
      ],
      difficulty: 'beginner',
      quiz: [
        {
          question: 'Which element represents a table row?',
          options: ['<td>', '<tr>', '<th>', '<table-row>'],
          correctAnswer: 1
        },
        {
          question: 'What attribute is used to merge columns in a table?',
          options: ['rowspan', 'colspan', 'merge', 'span'],
          correctAnswer: 1
        }
      ]
    },
    'multimedia': {
      title: 'Multimedia',
      description: 'Work with audio, video, and iframe elements',
      explanation: 'HTML5 provides native support for multimedia content through elements like <video>, <audio>, and <iframe>. These elements allow embedding videos, audio players, and external content while providing fallback options for unsupported browsers.',
      example: `<!-- Video Element -->
<video width="640" height="360" controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support the video element.
</video>

<!-- Audio Element -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>

<!-- IFrame Element -->
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/video-id" 
  frameborder="0" 
  allowfullscreen>
</iframe>`,
      practice: [
        'Embed a video with multiple source formats',
        'Create an audio player with controls',
        'Use iframes to embed external content safely'
      ],
      difficulty: 'intermediate',
      quiz: [
        {
          question: 'Which attribute enables video player controls?',
          options: ['player', 'controls', 'buttons', 'interface'],
          correctAnswer: 1
        },
        {
          question: 'What is the purpose of the source element?',
          options: [
            'To specify multiple format options',
            'To control volume',
            'To add subtitles',
            'To change playback speed'
          ],
          correctAnswer: 0
        }
      ]
    },
    'accessibility': {
      title: 'Accessibility',
      description: 'Implement ARIA attributes and create accessible web content',
      explanation: 'Web accessibility ensures content is usable by people with disabilities. This includes using proper semantic elements, ARIA attributes, and following WCAG guidelines. Good accessibility practices benefit all users and improve SEO.',
      example: `<!-- Accessible Button -->
<button 
  aria-label="Close dialog"
  aria-pressed="false"
  onclick="closeDialog()">
  <span class="icon">×</span>
</button>

<!-- Accessible Form -->
<form role="search">
  <label for="search">Search:</label>
  <input 
    type="search"
    id="search"
    name="search"
    aria-describedby="search-help"
  >
  <span id="search-help">
    Search for articles by keyword
  </span>
</form>

<!-- Accessible Image -->
<img 
  src="graph.png"
  alt="Sales growth chart showing 25% increase"
  role="img"
>`,
      practice: [
        'Add ARIA labels to interactive elements',
        'Create an accessible navigation menu',
        'Implement proper heading hierarchy'
      ],
      difficulty: 'advanced',
      quiz: [
        {
          question: 'What does ARIA stand for?',
          options: [
            'Accessible Rich Internet Applications',
            'Advanced Resource Integration API',
            'Automated Reading Interface Access',
            'Application Resource Integration Assistant'
          ],
          correctAnswer: 0
        },
        {
          question: 'Which attribute provides a text alternative for images?',
          options: ['alt', 'description', 'title', 'caption'],
          correctAnswer: 0
        }
      ]
    },
    'lists': {
      title: 'Lists',
      description: 'Master HTML list elements and their applications',
      explanation: 'HTML provides three types of lists: ordered lists (<ol>), unordered lists (<ul>), and description lists (<dl>). Lists can be nested and styled to create navigation menus, content hierarchies, and more.',
      example: `<!-- Unordered List -->
<ul>
  <li>First item</li>
  <li>Second item
    <ul>
      <li>Sub-item 1</li>
      <li>Sub-item 2</li>
    </ul>
  </li>
  <li>Third item</li>
</ul>

<!-- Ordered List -->
<ol type="1">
  <li>Step one</li>
  <li>Step two</li>
  <li>Step three</li>
</ol>

<!-- Description List -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>`,
      practice: [
        'Create nested lists with different styles',
        'Build a navigation menu using unordered lists',
        'Implement a FAQ page using description lists'
      ],
      difficulty: 'beginner',
      quiz: [
        {
          question: 'Which list type is best for step-by-step instructions?',
          options: ['Unordered list', 'Ordered list', 'Description list', 'None of these'],
          correctAnswer: 1
        },
        {
          question: 'What is the purpose of the <dt> element?',
          options: [
            'Define a list item',
            'Create a nested list',
            'Specify a description term',
            'Set list style type'
          ],
          correctAnswer: 2
        }
      ]
    },
    'meta-tags': {
      title: 'Meta Tags',
      description: 'Learn about HTML meta tags and their importance for SEO',
      explanation: 'Meta tags provide metadata about the HTML document. They are used to specify character set, viewport settings, SEO-related information, and social media previews. Proper meta tags are crucial for SEO and social sharing.',
      example: `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Character Set -->
  <meta charset="UTF-8">
  
  <!-- Viewport for Responsive Design -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="Learn web development with our comprehensive tutorials">
  <meta name="keywords" content="HTML, CSS, JavaScript, Web Development">
  <meta name="author" content="Your Name">
  
  <!-- Open Graph Tags for Social Media -->
  <meta property="og:title" content="Your Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:image" content="preview-image.jpg">
  <meta property="og:url" content="https://yoursite.com/page">
  
  <title>Your Page Title</title>
</head>`,
      practice: [
        'Add essential meta tags to a webpage',
        'Implement Open Graph tags for social sharing',
        'Configure viewport settings for responsive design'
      ],
      difficulty: 'intermediate',
      quiz: [
        {
          question: 'Which meta tag is used for character encoding?',
          options: ['<meta charset="UTF-8">', '<meta lang="UTF-8">', '<meta encoding="UTF-8">', '<meta type="UTF-8">'],
          correctAnswer: 0
        },
        {
          question: 'What is the purpose of the viewport meta tag?',
          options: [
            'To improve SEO rankings',
            'To control how the page scales on mobile devices',
            'To set the page title',
            'To define keywords'
          ],
          correctAnswer: 1
        }
      ]
    },
    'links': {
      title: 'Links & Navigation',
      description: 'Master HTML links, anchors, and navigation best practices',
      explanation: 'HTML links (<a> elements) are the foundation of web navigation. They can point to other pages, sections within the same page, files, or even trigger JavaScript functions. Understanding proper link structure and accessibility is crucial for good user experience.',
      example: `<!-- Basic Link -->
<a href="https://example.com">Visit Example.com</a>

<!-- Link with Target -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Open in New Tab
</a>

<!-- Section Navigation -->
<nav class="main-nav">
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- Download Link -->
<a href="document.pdf" download>
  Download PDF
</a>

<!-- Email Link -->
<a href="mailto:example@email.com">
  Send Email
</a>

<!-- Phone Link -->
<a href="tel:+1234567890">
  Call Us
</a>`,
      practice: [
        'Create a navigation menu with internal and external links',
        'Implement smooth scrolling to page sections',
        'Add download and contact links with proper attributes'
      ],
      difficulty: 'beginner',
      quiz: [
        {
          question: 'Which attribute should be used when opening links in a new tab?',
          options: ['new-tab', 'target="_blank"', 'open="new"', 'window="new"'],
          correctAnswer: 1
        },
        {
          question: 'What is the purpose of the rel="noopener" attribute?',
          options: [
            'To prevent styling of visited links',
            'To improve SEO ranking',
            'To prevent the new page from accessing window.opener',
            'To disable link underlining'
          ],
          correctAnswer: 2
        }
      ]
    },
    'images': {
      title: 'Images & Figures',
      description: 'Learn how to work with images, figures, and responsive images',
      explanation: 'Images are essential for web content. The <img> element, along with <figure> and <picture>, provides various ways to include and optimize images. Modern responsive image techniques help deliver the right image size for different devices.',
      example: `<!-- Basic Image -->
<img src="image.jpg" alt="Description of the image">

<!-- Figure with Caption -->
<figure>
  <img src="chart.png" alt="Sales chart showing growth">
  <figcaption>Monthly sales growth in 2024</figcaption>
</figure>

<!-- Responsive Images -->
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>

<!-- Image with Dimensions -->
<img 
  src="profile.jpg" 
  alt="User profile picture"
  width="200" 
  height="200"
  loading="lazy"
>`,
      practice: [
        'Implement responsive images using the picture element',
        'Create an image gallery with figures and captions',
        'Optimize images for different screen sizes'
      ],
      difficulty: 'beginner',
      quiz: [
        {
          question: 'Why is the alt attribute important?',
          options: [
            'It improves image quality',
            'It provides accessibility and fallback text',
            'It makes images load faster',
            'It prevents image copying'
          ],
          correctAnswer: 1
        },
        {
          question: 'What is the purpose of the loading="lazy" attribute?',
          options: [
            'To improve image quality',
            'To defer loading until the image is near the viewport',
            'To add loading animations',
            'To reduce image size'
          ],
          correctAnswer: 1
        }
      ]
    },
    'text-formatting': {
      title: 'Text Formatting',
      description: 'Understand HTML text elements and formatting options',
      explanation: 'HTML provides various elements for text formatting and structure. This includes headings, paragraphs, emphasis, and other inline text elements. Proper use of these elements improves readability and SEO.',
      example: `<!-- Headings -->
<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Section Heading</h3>

<!-- Paragraphs and Text Formatting -->
<p>This is a paragraph with <strong>bold text</strong> and <em>emphasized text</em>.</p>

<!-- Text Formatting -->
<p>This text contains <mark>highlighted</mark>, <sub>subscript</sub>, and <sup>superscript</sup>.</p>

<!-- Quotations -->
<blockquote>
  <p>This is a long quotation that stands on its own.</p>
  <cite>- Author Name</cite>
</blockquote>

<p>This text includes an <q>inline quotation</q>.</p>

<!-- Code and Preformatted Text -->
<pre><code>
function example() {
  return "Hello, World!";
}
</code></pre>`,
      practice: [
        'Create a blog post using proper heading hierarchy',
        'Format text using various inline elements',
        'Implement quotes and citations correctly'
      ],
      difficulty: 'beginner',
      quiz: [
        {
          question: 'Which element should be used for the most important heading?',
          options: ['<header>', '<h6>', '<h1>', '<title>'],
          correctAnswer: 2
        },
        {
          question: 'What is the difference between <strong> and <b>?',
          options: [
            'They are exactly the same',
            '<strong> indicates importance while <b> is purely visual',
            '<strong> is deprecated',
            '<b> is more semantic'
          ],
          correctAnswer: 1
        }
      ]
    },
    'attributes': {
      title: 'HTML Attributes',
      description: 'Master common and custom HTML attributes',
      explanation: 'HTML attributes provide additional information or functionality to elements. They can modify behavior, add interactivity, improve accessibility, and provide metadata. Understanding attributes is crucial for creating interactive and accessible web content.',
      example: `<!-- Common Global Attributes -->
<div id="unique-id" class="multiple classes" hidden>
  Hidden content
</div>

<!-- Custom Data Attributes -->
<button 
  data-action="submit"
  data-user-id="123"
  onclick="handleClick(this)">
  Click Me
</button>

<!-- ARIA Attributes -->
<div role="alert" aria-live="polite">
  Status message
</div>

<!-- Input Attributes -->
<input 
  type="email"
  name="user-email"
  required
  minlength="5"
  maxlength="50"
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
  placeholder="Enter your email"
>

<!-- Link Attributes -->
<a 
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  title="Visit our website">
  Learn More
</a>`,
      practice: [
        'Add custom data attributes and access them with JavaScript',
        'Implement form validation using HTML attributes',
        'Use ARIA attributes to improve accessibility'
      ],
      difficulty: 'intermediate',
      quiz: [
        {
          question: 'Which prefix is used for custom data attributes?',
          options: ['data-', 'custom-', 'attr-', 'user-'],
          correctAnswer: 0
        },
        {
          question: 'What is the purpose of the title attribute?',
          options: [
            'To set the document title',
            'To provide tooltip text',
            'To style elements',
            'To define headings'
          ],
          correctAnswer: 1
        }
      ]
    }
  };

  private htmlConceptsList: Concept[] = [
    {
      id: 'div',
      title: 'Div Element',
      description: 'Learn about the div element and how to use it for content division and layout',
      difficulty: 'beginner'
    },
    {
      id: 'semantic-elements',
      title: 'Semantic Elements',
      description: 'Understand semantic HTML elements like header, nav, main, article, and footer',
      difficulty: 'intermediate'
    },
    {
      id: 'forms',
      title: 'Forms & Input',
      description: 'Master HTML forms, input types, and form validation attributes',
      difficulty: 'intermediate'
    },
    {
      id: 'tables',
      title: 'Tables',
      description: 'Learn table structure and advanced features like colspan and rowspan',
      difficulty: 'beginner'
    },
    {
      id: 'multimedia',
      title: 'Multimedia',
      description: 'Work with audio, video, and iframe elements',
      difficulty: 'intermediate'
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'Implement ARIA attributes and create accessible web content',
      difficulty: 'advanced'
    },
    {
      id: 'lists',
      title: 'Lists',
      description: 'Master HTML list elements and their applications',
      difficulty: 'beginner'
    },
    {
      id: 'meta-tags',
      title: 'Meta Tags',
      description: 'Learn about HTML meta tags and their importance for SEO',
      difficulty: 'intermediate'
    },
    {
      id: 'links',
      title: 'Links & Navigation',
      description: 'Master HTML links, anchors, and navigation best practices',
      difficulty: 'beginner'
    },
    {
      id: 'images',
      title: 'Images & Figures',
      description: 'Learn how to work with images, figures, and responsive images',
      difficulty: 'beginner'
    },
    {
      id: 'text-formatting',
      title: 'Text Formatting',
      description: 'Understand HTML text elements and formatting options',
      difficulty: 'beginner'
    },
    {
      id: 'attributes',
      title: 'HTML Attributes',
      description: 'Master common and custom HTML attributes',
      difficulty: 'intermediate'
    }
  ];

  getHtmlConcepts(): Observable<Concept[]> {
    return of(this.htmlConceptsList);
  }

  getHtmlConceptContent(conceptId: string): Observable<ConceptContent | undefined> {
    return of(this.htmlConcepts[conceptId]);
  }
} 