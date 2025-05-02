import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PassportModule, AuthModule],
  controllers: [CinemaController],
  providers: [CinemaService,JwtStrategy,PrismaService]
})
export class CinemaModule {}
