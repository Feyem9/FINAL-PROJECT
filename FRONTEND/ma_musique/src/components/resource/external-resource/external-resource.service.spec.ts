import { Test, TestingModule } from '@nestjs/testing';
import { ExternalResourceService } from './external-resource.service';

describe('ExternalResourceService', () => {
  let service: ExternalResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalResourceService],
    }).compile();

    service = module.get<ExternalResourceService>(ExternalResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
