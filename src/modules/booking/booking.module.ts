import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [PassportModule,AuthModule, HttpModule],
  controllers: [BookingController],
  providers: [BookingService,PrismaService]
})
export class BookingModule {}
