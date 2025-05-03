import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_SECRET , ACCESS_TOKEN_EXPIRES } from 'src/common/constant/app.constant';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret : ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,TokenService],
  exports : [JwtModule]
})
export class AuthModule {}
