import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async encryptPassword(rawPassWord: string) {
    console.log(rawPassWord);
    return await bcrypt.hash(rawPassWord, 10);
  }
  async create(createUserDto: Prisma.UserCreateInput) {
    const isUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { userName: createUserDto.userName },
        ],
      },
    });
    if (isUser) {
      throw new ConflictException('Email or UserName already exist');
    }
    if (createUserDto.passWord)
      createUserDto.passWord = await this.encryptPassword(
        createUserDto.passWord
      );
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    try {
      const user = await this.prisma.user.findMany();
      if (user) {
        return user;
      } else {
        return [];
      }
    } catch (error: unknown) {
      console.log('error message is:', error);
    }
  }

  async findOne(id: number) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (foundUser) {
      foundUser['passWordActive'] = foundUser.passWord ? true : false;
    }
    const returnedUser = { ...foundUser, passWord: foundUser?.passWord };
    return returnedUser;
  }
  async findOneByUserName(userName: string) {
    return await this.prisma.user.findUnique({
      where: { userName: userName },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
