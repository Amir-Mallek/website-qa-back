import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class HtmlValidatorService {
  API_URL = 'https://validator.nu/';

  constructor(private readonly httpService: HttpService) {}

  getHtmlValidationReport(url: string) {
    return this.httpService
      .get(`${this.API_URL}?doc=${url}&out=json`)
      .pipe(map((response) => response.data.messages));
  }
}
