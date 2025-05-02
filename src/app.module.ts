import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { CinemaModule } from './modules/cinema/cinema.module';

@Module({
  imports: [AuthModule, UserModule, MovieModule, CinemaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
