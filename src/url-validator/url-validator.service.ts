import { Injectable } from '@nestjs/common';
import { BrowserService } from '../browser/browser.service';

@Injectable()
export class UrlValidatorService {
  constructor(private browserService: BrowserService) {}

  async validateUrl(url: string): Promise<{ valid: boolean }> {
    const page = await this.browserService.getPage();
    try {
      await page.goto(url);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }
}
