import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UrlPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      throw new BadRequestException('URL is required');
    }

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return `http://${value}`;
    }
    return value;
  }
}
