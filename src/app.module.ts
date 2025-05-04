import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { CinemaModule } from './modules/cinema/cinema.module';
import { ProtectStrategy } from './modules/auth/protect/protect.strategy';
import { PrismaService } from './modules/prisma/prisma.service';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [AuthModule, UserModule, MovieModule, CinemaModule, BookingModule],
  controllers: [AppController],
  providers: [AppService,ProtectStrategy,PrismaService],
})
export class AppModule {}
