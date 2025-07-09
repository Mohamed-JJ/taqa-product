import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: Prisma.UserCreateInput = {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'user name',
        passWord: 'something secure',
        email: 'john@example.com',
      };
      mockUserService.create.mockResolvedValue(createUserDto);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: 1, firsName: 'John Doe', email: 'john@example.com' };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(String(1));

      expect(result).toEqual(user);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: Prisma.UserUpdateInput = { firstName: 'Jane' };
      const updatedUser = {
        id: 1,
        firstName: 'Jane',
        email: 'john@example.com',
      };
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(String(1), updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const deletedUser = { id: 1 };
      mockUserService.remove.mockResolvedValue(deletedUser);

      const result = await controller.remove(String(1));

      expect(result).toEqual(deletedUser);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });
  });
});
