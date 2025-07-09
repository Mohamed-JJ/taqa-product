import { Test, TestingModule } from '@nestjs/testing';
import { ChangeHistoryController } from './change-history.controller';
import { ChangeHistoryService } from './change-history.service';

describe('ChangeHistoryController', () => {
  let controller: ChangeHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangeHistoryController],
      providers: [ChangeHistoryService],
    }).compile();

    controller = module.get<ChangeHistoryController>(ChangeHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
