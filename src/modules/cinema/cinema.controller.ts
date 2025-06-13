import { Body, Controller, Delete, Get, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { addCinemaSystemDto } from './Dto/add-cinemasystem.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { addCinemaClusterDto } from './Dto/add-cinemacluster.dto';
@ApiExtraModels(addCinemaSystemDto)
@Controller('QuanLyRap')
export class CinemaController {
    constructor(private readonly cinemaService : CinemaService){}
    @Get('LayThongTinHeThongRap')
    @ApiBearerAuth('AccessToken')
    async getCinemaSystem(){
      return await this.cinemaService.getCinemaSystem()
    }
    @Post('ThemHeThongRap')
    @ApiBearerAuth('AccessToken')
    @UseInterceptors(FileInterceptor('logo'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
            schema: {
              allOf: [
                { $ref: getSchemaPath(addCinemaSystemDto) },
                {
                  type: 'object',
                  properties: {
                    logo: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                },
              ],
            },
    })
    async addCinemaSystem(
       @Body()
       body : addCinemaSystemDto,
        @UploadedFile(new ParseFilePipe({
          validators : [
            new MaxFileSizeValidator({maxSize : 1000000})
          ]
        }))
           file : Express.Multer.File
        ){
            const cinemaData = {
                ...body,
                logo : file.filename
            }
            return this.cinemaService.addCinemaSystem(cinemaData,file);
    }
    @Get('LayThongTinCumRapTheoHeThong')
    @ApiBearerAuth('AccessToken')
    async getCinemaCluster(
        @Query('maHeThongRap')
        maHeThongRap : number

    ){
        return await this.cinemaService.getCinemaCluster(maHeThongRap)
    }
    @Post('ThemCumRapTheoHeThong')
    @ApiBearerAuth('AccessToken')
    async addCinemaCluster(
      @Body() body : addCinemaClusterDto
    ){
      return await this.cinemaService.addCinemaCluster(body)
    }
    @Delete('XoaCumRapTheoHeThong')
    @ApiBearerAuth('AccessToken')
    async deleteCinemaCluster(
      @Query('maCumRap') maCumRap : number 
    ){
      return await this.cinemaService.deleteCinemaCluster(maCumRap)
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
