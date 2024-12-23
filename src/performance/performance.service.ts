import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class PerformanceService {
  API_URL =
    'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor(private readonly httpService: HttpService) {}

  getPerformanceReport(url: string) {
    return this.httpService.get(`${this.API_URL}?url=${url}`).pipe(
      map((response) => {
        const metrics = response.data.loadingExperience.metrics;
        const cls = {
          id: 'Cumulative Layout Shift',
          short: 'CLS',
          value: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile,
          displayValue: `${metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100}`,
          distributions: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.distributions,
          multiplier: 1 / 100,
          unit: '',
          description:
            'Cumulative Layout Shift measures the movement of visible elements within the viewport.',
          learnMore: 'https://web.dev/articles/cls',
        };
        const fcp = {
          id: 'First Contentful Paint',
          short: 'FCP',
          value: metrics.FIRST_CONTENTFUL_PAINT_MS.percentile,
          displayValue: `${metrics.FIRST_CONTENTFUL_PAINT_MS.percentile / 1000} s`,
          distributions: metrics.FIRST_CONTENTFUL_PAINT_MS.distributions,
          multiplier: 1 / 1000,
          unit: 's',
          description:
            'First Contentful Paint marks the time at which the first text or image is painted.',
          learnMore:
            'https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/',
        };
        const lcp = {
          id: 'Largest Contentful Paint',
          short: 'LCP',
          value: metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile,
          displayValue: `${metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile / 1000} s`,
          distributions: metrics.LARGEST_CONTENTFUL_PAINT_MS.distributions,
          multiplier: 1 / 1000,
          unit: 's',
          description:
            'Largest Contentful Paint marks the time at which the largest text or image is painted.',
          learnMore:
            'https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/',
        };
        const ttfb = {
          id: 'Time To First Byte',
          short: 'TTFB',
          value: metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.percentile,
          displayValue: `${metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.percentile / 1000} s`,
          distributions: metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.distributions,
          multiplier: 1 / 1000,
          unit: 's',
          description:
            'Time to First Byte is the time the time between the browser requesting a page and when it receives the first byte of information from the server. ',
          learnMore:
            'https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte',
        };
        const inp = {
          id: 'Interaction to Next Paint',
          short: 'INP',
          value: metrics.INTERACTION_TO_NEXT_PAINT.percentile,
          displayValue: `${metrics.INTERACTION_TO_NEXT_PAINT.percentile} ms`,
          distributions: metrics.INTERACTION_TO_NEXT_PAINT.distributions,
          multiplier: 1,
          unit: 'ms',
          description:
            "INP is a metric that assesses a page's overall responsiveness to user interactions by observing the latency of all click, tap, and keyboard interactions.",
          learnMore: 'https://web.dev/articles/inp',
        };

        return [cls, fcp, lcp, ttfb, inp];
      }),
    );
  }
}
