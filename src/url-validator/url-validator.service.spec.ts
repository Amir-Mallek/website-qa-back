import { Test, TestingModule } from '@nestjs/testing';
import { UrlValidatorService } from './url-validator.service';

describe('UrlValidatorService', () => {
  let service: UrlValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlValidatorService],
    }).compile();

    service = module.get<UrlValidatorService>(UrlValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
