import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from './constants';
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtContants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],

  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
