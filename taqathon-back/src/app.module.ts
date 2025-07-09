import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
// import { PassportAuthController } from './auth/passport-auth.controller';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AnomalyModule } from './anomaly/anomaly.module';
import { MaintenanceWindowsModule } from './maintenance-windows/maintenance-windows.module';
import { AttachementsModule } from './attachements/attachements.module';
import { CommentsModule } from './comments/comments.module';
import { ChangeHistoryModule } from './change-history/change-history.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AnomalyModule,
    MaintenanceWindowsModule,
    AttachementsModule,
    CommentsModule,
    ChangeHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService, JwtStrategy],
})
export class AppModule {}
