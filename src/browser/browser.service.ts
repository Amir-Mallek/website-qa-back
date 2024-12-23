import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name);
  private browser: puppeteer.Browser;

  constructor() {
    puppeteer
      .launch({ headless: true })
      .then((browser) => {
        this.browser = browser;
        this.logger.log('Browser launched');
      })
      .catch((error) => {
        this.logger.error('Error launching browser', error);
      });
  }

  getPage(): Promise<puppeteer.Page> {
    return this.browser.newPage();
  }
}
