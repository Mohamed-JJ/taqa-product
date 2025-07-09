import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique user email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'johndoe123',
    description: 'Unique user name',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Optional password for the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  passWord?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class User {
  id: number;
  email: string;
  firstName: string;
  userName: string;
  lastName: string;
}
