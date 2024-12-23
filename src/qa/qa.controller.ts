import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AccessibilityService } from '../accessibility/accessibility.service';
import * as axe from 'axe-core';
import { HtmlValidatorService } from '../html-validator/html-validator.service';
import { UrlPipe } from '../url/url.pipe';
import { PerformanceService } from '../performance/performance.service';
import { SeoService } from '../seo/seo.service';
import { UrlValidatorService } from '../url-validator/url-validator.service';

@Controller('qa')
export class QaController {
  private readonly logger = new Logger(QaController.name);

  constructor(
    private accessibilityService: AccessibilityService,
    private htmlValidationService: HtmlValidatorService,
    private performanceService: PerformanceService,
    private seoService: SeoService,
    private urlValidatorService: UrlValidatorService,
  ) {}

  @Get('validate')
  validateUrl(@Query('url', new UrlPipe()) url: string) {
    this.logger.log(`Validating URL: ${url}`);

    return this.urlValidatorService.validateUrl(url);
  }

  @Get('accessibility')
  getAccessibilityReport(
    @Query('url', new UrlPipe()) url: string,
  ): Promise<axe.Result[]> {
    this.logger.log(`Getting accessibility report for ${url}`);

    return this.accessibilityService.getAccessibilityReport(url);
  }

  @Get('html-validation')
  getHtmlValidationReport(@Query('url', new UrlPipe()) url: string) {
    this.logger.log(`Getting HTML validation report for ${url}`);

    return this.htmlValidationService.getHtmlValidationReport(url);
  }

  @Get('performance')
  getPerformanceReport(@Query('url', new UrlPipe()) url: string) {
    this.logger.log(`Getting performance report for ${url}`);

    return this.performanceService.getPerformanceReport(url);
  }

  @Get('seo')
  getSeoReport(@Query('url', new UrlPipe()) url: string) {
    this.logger.log(`Getting SEO report for ${url}`);

    return this.seoService.getSeoReport(url);
  }
}
