import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { PassPortJwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, User } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: Prisma.UserCreateInput) {
    try {
      const createdUser = await this.userService.create(createUserDto);
      console.log('created user is', createdUser);
      return createdUser;
    } catch (error: unknown) {
      console.log(error);
    }
  }

  @UseGuards(PassPortJwtGuard)
  @Get()
  @ApiResponse({
    type: [User],
    example: [
      {
        id: 1,
        email: 'string',
        firstName: 'string',
        userName: 'string',
        lastName: 'string',
      },
    ],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: User,
    example: {
      id: 1,
      email: 'string',
      firstName: 'string',
      userName: 'string',
      lastName: 'string',
    },
  })
  @ApiParam({ name: 'id', type: 'number', description: 'user ID' })
  @UseGuards(PassPortJwtGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'user ID' })
  @ApiBody({ type: UpdateUserDto, required: false })
  @ApiResponse({ status: 204 })
  @UseGuards(PassPortJwtGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'user ID' })
  @UseGuards(PassPortJwtGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
