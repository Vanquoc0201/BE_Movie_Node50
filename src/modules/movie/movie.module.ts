import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  imports: [PassportModule, AuthModule],
  controllers: [MovieController],
  providers: [MovieService,PrismaService,JwtStrategy]
})
export class MovieModule {}
