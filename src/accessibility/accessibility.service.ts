import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BrowserService } from '../browser/browser.service';
import * as axe from 'axe-core';

@Injectable()
export class AccessibilityService {
  private readonly logger = new Logger(AccessibilityService.name);

  constructor(private browserService: BrowserService) {}

  async getAccessibilityReport(url: string): Promise<axe.Result[]> {
    const page = await this.browserService.getPage();

    try {
      await page.goto(url);
    } catch (error) {
      this.logger.error('Error navigating to URL', error);
      throw new BadRequestException('Invalid URL');
    }

    await page.evaluate((axeSource) => {
      const script = document.createElement('script');
      script.textContent = axeSource;
      document.head.appendChild(script);
    }, axe.source);

    const results = await page.evaluate(async () => {
      return axe.run();
    });

    await page.close();

    results.violations.forEach((violation) => {
      delete violation.nodes;
    });

    return results.violations;
  }
}
