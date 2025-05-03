import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports : [PassportModule, AuthModule],
  controllers: [UserController],
  providers: [UserService,PrismaService]
})
export class UserModule {}
