import { Test, TestingModule } from '@nestjs/testing';
import { HtmlValidatorService } from './html-validator.service';

describe('HtmlValidatorService', () => {
  let service: HtmlValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtmlValidatorService],
    }).compile();

    service = module.get<HtmlValidatorService>(HtmlValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
