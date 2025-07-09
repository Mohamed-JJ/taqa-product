import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    super({
      clientID: process.env['42_UID'],
      clientSecret: process.env['42_SECRET'],
      callbackURL: process.env['42_CALLBACK_URL'],
      Scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const user = await this.userService.findOneByEmail(
        profile.emails[0].value as string
      );
      if (user) {
        const retUser = await this.authService.signIn({
          userName: user.userName,
          id: String(user.id),
        });
        return retUser;
      } else {
        const createdUser = await this.userService.create({
          firstName: profile.name.givenName as string,
          lastName: profile.name.familyName as string,
          userName: profile.username as string,
          email: profile.emails[0].value as string,
          passWord: null,
        });
        const retUser = await this.authService.signIn({
          userName: createdUser.userName,
          id: String(createdUser.id),
        });
        return retUser;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
