import { Test, TestingModule } from '@nestjs/testing';
import { ChangeHistoryService } from './change-history.service';

describe('ChangeHistoryService', () => {
  let service: ChangeHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeHistoryService],
    }).compile();

    service = module.get<ChangeHistoryService>(ChangeHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
