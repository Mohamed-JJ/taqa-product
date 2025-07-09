// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class FortyTwoGuard extends AuthGuard('42') {
//   async canActivate(context: ExecutionContext) {
//     try {
//       const activate = (await super.canActivate(context)) as boolean;
//       const request = context.switchToHttp().getRequest();
//       await super.logIn(request);
//       return activate;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
// }

// src/auth/guards/42.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const activate = (await super.canActivate(context)) as boolean;

      // removed to avoid using sessions
      // const request = context.switchToHttp().getRequest();
      // await super.logIn(request);
      return activate;
    } catch (error) {
      console.log('42 Guard Error:', error);
      throw error;
    }
  }
}
