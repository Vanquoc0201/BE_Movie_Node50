import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('QuanLyRap')
export class CinemaController {
    constructor(private readonly cinemaService : CinemaService){}
    @Get('LayThongTinHeThongRap')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async getCinemaSystem(){
        return await this.cinemaService.getCinemaSystem()
    }
    @Get('LayThongTinCumRapTheoHeThong')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('AccessToken')
    async getCinemaCluster(
        @Query('maHeThongRap')
        maHeThongRap : number

    ){
        return await this.cinemaService.getCinemaCluster(maHeThongRap)
    }
}
