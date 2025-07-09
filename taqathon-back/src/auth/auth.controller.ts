import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { Public } from './decorators/public.decorator';
import { FortyTwoGuard } from './guards/42.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { PassPortJwtGuard } from './guards/jwt.guard';
import { Response } from 'express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CanAccess, Login } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ type: Login })
  @ApiBody({ type: Login })
  async login(@Req() req, @Res() res: Response) {
    console.log('hello there from local auth');
    const response = req.user;
    try {
      res.cookie('data', JSON.stringify(response));
      console.log('hello there Setting Cookie !');

      // res.redirect(
      //   `${process.env.FRONT_URL}/auth/verify?accessToken=${response.accessToken}&uid=${response.id}&uname=${response.userName}`
      // );
      return res.json({
        success: true,
        accessToken: response.accessToken,
        id: response.id,
        userName: response.userName,
        redirectUrl: `${process.env.FRONT_URL}/auth/verify?accessToken=${response.accessToken}&uid=${response.id}&uname=${response.userName}`,
      });
    } catch (e) {
      console.log('------', e);
    }
  }

  /**
   * @description check if the current access token is valid or not
   * @returns a object with status if the route is accessable with the current access token, if not it will throw an error of 401
   */

  // @Get('/google/login')
  // @Public()
  // @UseGuards(GoogleGuard)
  // authGoogle() {}

  // @Get('/google/callback')
  // @Public()
  // @UseGuards(GoogleGuard)
  // async GoogleCallBack(@Req() req, @Res() res) {
  //   const response = await this.authService.signIn({
  //     userName: req.user.userName as string,
  //     id: req.user.id,
  //   });
  //   res.cookie('data', JSON.stringify(response));
  //   res.redirect(
  //     `${process.env.FRONT_URL}/auth/verify?accessToken=${response.accessToken}&uid=${response.id}&uname=${response.userName}`
  //   );
  // }

  // @Get('/42/login')
  // @Public()
  // @UseGuards(FortyTwoGuard)
  // auth42() {}

  // @Get('/42/callback')
  // @Public()
  // @UseGuards(FortyTwoGuard)
  // async CallBack42(@Req() req, @Res() res) {
  //   const response = await this.authService.signIn({
  //     userName: req.user.userName as string,
  //     id: String(req.user.id),
  //   });
  //   res.cookie('data', JSON.stringify(response));
  //   res.redirect(
  //     `${process.env.FRONT_URL}/auth/verify?accessToken=${response.accessToken}&uid=${response.id}&uname=${response.userName}`
  //   );
  //   // return response;
  // }

  @HttpCode(200)
  @UseGuards(PassPortJwtGuard)
  @Get('/canAccess')
  @ApiResponse({ type: CanAccess })
  async canAccess() {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await { status: 'success' };
  }
}
