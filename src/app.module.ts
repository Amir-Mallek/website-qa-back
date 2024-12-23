import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrowserService } from './browser/browser.service';
import { AccessibilityService } from './accessibility/accessibility.service';
import { QaController } from './qa/qa.controller';
import { HtmlValidatorService } from './html-validator/html-validator.service';
import { HttpModule } from '@nestjs/axios';
import { PerformanceService } from './performance/performance.service';
import { ConfigModule } from '@nestjs/config';
import { SeoService } from './seo/seo.service';
import { UrlValidatorService } from './url-validator/url-validator.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController, QaController],
  providers: [
    AppService,
    BrowserService,
    AccessibilityService,
    HtmlValidatorService,
    PerformanceService,
    SeoService,
    UrlValidatorService,
  ],
})
export class AppModule {}
