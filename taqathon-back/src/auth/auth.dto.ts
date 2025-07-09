import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CanAccess {
  @ApiProperty({
    example: 'success',
    description: 'the status of the auth check',
  })
  status: string;
}

export class Login {
  @ApiProperty({
    example: 'username',
    description: 'the user name of the user',
  })
  userName: string;
  @ApiProperty({
    example: 'strongPassword123',
    description: 'password for the user',
    required: true,
  })
  //   @IsOptional()
  @IsString()
  passWord: string;
}
