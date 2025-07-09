/* eslint-disable prettier/prettier */ import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
 
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value as string,
      firstName: name.givenName as string,
      lastName: name.familyName as string,
      picture: photos[0].value as string,
      accessToken,
    };
  try {
    const existingUser = await this.userService.findOneByEmail(user?.email);
    if (existingUser) {
      return done(null, existingUser);
    } else {
      const createdUser = await this.userService.create({
        firstName: user.firstName,
        lastName: user.lastName ,
        userName: `${String(user.firstName)}${user.lastName}`,
        email: user.email,
        passWord: null,
      });
      return done(null, createdUser);
    }
  } catch (error: unknown) {
    console.log("the error is", error)
  }
   }
}
