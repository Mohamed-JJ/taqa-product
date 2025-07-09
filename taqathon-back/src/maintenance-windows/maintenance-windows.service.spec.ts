import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceWindowsService } from './maintenance-windows.service';

describe('MaintenanceWindowsService', () => {
  let service: MaintenanceWindowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceWindowsService],
    }).compile();

    service = module.get<MaintenanceWindowsService>(MaintenanceWindowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
