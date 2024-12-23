import { Injectable } from '@nestjs/common';
import * as jsdom from 'jsdom';
import { HttpService } from '@nestjs/axios';
import { from, map, Observable, switchMap } from 'rxjs';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

const { JSDOM } = jsdom;

@Injectable()
export class SeoService {
  private context = `
You are an expert in Search Engine Optimization (SEO) and web accessibility. Your task is to analyze the provided HTML content and assess if it follows SEO best practices. Provide actionable feedback in each category, citing specific examples from the HTML content when applicable. The analysis should cover the following areas:

---

### **1. Metadata Optimization**:
   - Check the \`<head>\` section for:
     - \`<title>\`: Is it concise, descriptive, and includes primary keywords?
     - \`<meta name="description">\`: Is the description present, engaging, and within 155 characters?
     - \`<link rel="canonical">\`: Is the canonical tag correctly set to prevent duplicate content issues?

---

### **2. Heading Structure and Keyword Usage**:
   - Analyze the \`<h1>\`, \`<h2>\`, and \`<h3>\` tags:
     - Is there only one \`<h1>\` tag, and does it summarize the page's primary topic?
     - Are headings structured logically (e.g., \`<h2>\` follows \`<h1>\`, \`<h3>\` follows \`<h2>\`)?
     - Are primary and secondary keywords naturally included in the headings?

---

### **3. Content Optimization**:
   - Analyze the text content in \`<p>\` tags:
     - Is the content relevant, informative, and of appropriate length?
     - Are keywords used naturally without overstuffing?
     - Is the tone appropriate for the target audience?

---

### **4. Anchor Tags and Link Quality**:
   - Check the \`<a>\` tags for:
     - Presence of descriptive anchor text that explains the purpose of the link.
     - Proper use of internal and external links.
     - Are external links using the \`rel="nofollow"\` or \`rel="noopener"\` attribute where necessary (e.g., for sponsored links)?
     - Are there unnecessary links (e.g., duplicate links or "click here" text)?

---

### **5. Image Optimization**:
   - Analyze the \`<img>\` tags:
     - Does every \`<img>\` have an \`alt\` attribute that describes the image content?
     - Are file names descriptive and optimized for keywords (e.g., "example-image.jpg")?
     - Are image sizes likely optimized to ensure fast loading?

---

### **6. Accessibility and Mobile-Friendliness**:
   - Check for the presence of:
     - \`<meta name="viewport">\`: Does it ensure responsive design?
     - Accessibility attributes like \`aria-label\` or \`alt\` for icons and images.
   - Is the content structured to scale correctly for mobile and desktop devices?

---

### **7. Technical SEO**:
   - Evaluate the technical aspects of the HTML:
     - Is the HTML clean and free of unnecessary inline styles, scripts, or deprecated tags?
     - Does the page include structured data (e.g., JSON-LD or Microdata)?
     - Are there missing or duplicate \`<meta>\` tags?

---

### **8. Overall Recommendations**:
   - Provide a prioritized list of improvements with actionable steps to optimize the page for SEO.

---
`;
  private openai: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  extractRelevantHtml(html: string): string {
    try {
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const head = document.querySelector('head');
      const headHtml = head ? head.innerHTML : '';

      const body = document.querySelector('body');

      const headings = Array.from(body?.querySelectorAll('h1, h2, h3') || [])
        .map((el) => el.outerHTML)
        .join('\n');

      const images = Array.from(body?.querySelectorAll('img[alt]') || [])
        .map((el) => el.outerHTML)
        .join('\n');

      const links = Array.from(body?.querySelectorAll('a[href]') || [])
        .map((el) => el.outerHTML)
        .join('\n');

      const paragraphs = Array.from(body?.querySelectorAll('p') || [])
        .slice(0, 5) // Limit to the first 5 paragraphs to reduce content size
        .map((el) => el.outerHTML)
        .join('\n');

      // Combine the extracted content
      const relevantHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          ${headHtml}
        </head>
        <body>
          ${headings}
          ${images}
          ${links}
          ${paragraphs}
        </body>
        </html>
      `;

      return relevantHtml.trim();
    } catch (error) {
      console.error('Error processing HTML:', error);
      return '';
    }
  }

  async promptForSeoAnalysis(prompt: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'developer', content: this.context },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
    });
    return completion.choices[0].message.content;
  }

  getSeoReport(url: string): Observable<{ content: string }> {
    return this.httpService.get(url).pipe(
      map((response) => this.extractRelevantHtml(response.data)),
      switchMap((relevantHtml) =>
        from(this.promptForSeoAnalysis(relevantHtml)),
      ),
      map((analysis) => ({ content: analysis })),
    );
  }
}
