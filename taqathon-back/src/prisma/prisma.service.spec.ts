import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      // Arrange: Mock the $connect method
      const connectSpy = jest
        .spyOn(service, '$connect')
        .mockResolvedValueOnce(undefined);

      // Act: Call onModuleInit
      await service.onModuleInit();

      // Assert: Expect $connect to have been called
      expect(connectSpy).toHaveBeenCalled();

      // Clean up: Restore the original method
      connectSpy.mockRestore();
    });
  });
});
