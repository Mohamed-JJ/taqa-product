import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validatePassWord(hashedPass: string, rawPass: string) {
    if (await bcrypt.compare(rawPass, hashedPass)) console.log('good');
    else console.log('not good');
    return await bcrypt.compare(rawPass, hashedPass);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async authenticate(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (
      user &&
      user.passWord &&
      (await this.validatePassWord(user.passWord, pass))
    ) {
      const ret = await this.signIn({
        userName: user.userName,
        id: String(user.id),
      });
      return ret;
    }
    throw new UnauthorizedException();
  }

  async signIn(user: { id: string; userName: string }) {
    const payload = {
      sub: user.id,
      userName: user.userName,
    };
    console.log(payload);

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, userName: user.userName, id: user.id };
  }
}
