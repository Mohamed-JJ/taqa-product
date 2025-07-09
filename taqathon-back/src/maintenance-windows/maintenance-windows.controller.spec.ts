import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceWindowsController } from './maintenance-windows.controller';
import { MaintenanceWindowsService } from './maintenance-windows.service';

describe('MaintenanceWindowsController', () => {
  let controller: MaintenanceWindowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceWindowsController],
      providers: [MaintenanceWindowsService],
    }).compile();

    controller = module.get<MaintenanceWindowsController>(
      MaintenanceWindowsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
