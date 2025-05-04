import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('QuanLyRap')
export class CinemaController {
    constructor(private readonly cinemaService : CinemaService){}
    @Get('LayThongTinHeThongRap')
    @ApiBearerAuth('AccessToken')
    async getCinemaSystem(){
        return await this.cinemaService.getCinemaSystem()
    }
    @Get('LayThongTinCumRapTheoHeThong')
    @ApiBearerAuth('AccessToken')
    async getCinemaCluster(
        @Query('maHeThongRap')
        maHeThongRap : number

    ){
        return await this.cinemaService.getCinemaCluster(maHeThongRap)
    }
    @Get('LayThongTinLichChieuTheoHeThongRap')
    @ApiBearerAuth('AccessToken')
    async getShowTimesByCinemaCluster(
      @Query('maHeThongRap') maHeThongRap : number
    ){
      return await this.cinemaService.getShowTimesByCinemaCluster(maHeThongRap)
    }
    @Get('LayThongTinLichChieuTheoMaPhim')
    @ApiBearerAuth('AccessToken')
    async getShowTimesByMovies(
      @Query('maPhim') maPhim: number
    ){
      return this.cinemaService.getShowTimesByMovies(maPhim)
    }
}
