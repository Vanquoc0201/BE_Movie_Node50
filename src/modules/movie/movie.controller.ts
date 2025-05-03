import {  Body, Controller, Delete, Get, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { AddMovieDto } from './Dto/addmovie-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../user/Dto/pagination-user.dto';

@ApiExtraModels(AddMovieDto)
@Controller('QuanLyPhim')
export class MovieController {
    constructor(private readonly movieService : MovieService) {}



    @Post('ThemPhim')
    @ApiBearerAuth('AccessToken')
    @UseInterceptors(FileInterceptor('hinhAnh'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          allOf: [
            { $ref: getSchemaPath(AddMovieDto) },
            {
              type: 'object',
              properties: {
                hinhAnh: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          ],
        },
    })
    async addMovie(
        @Body()
        body : AddMovieDto,
        @UploadedFile(new ParseFilePipe({
            validators : [
                new MaxFileSizeValidator({maxSize : 1000000})
            ]
        }))
       file : Express.Multer.File
    ){
        const movieData = {
            ...body,
            hinhAnh : file.filename
        }
        return this.movieService.addMovie(movieData,file);
    }

    @Get('LayDanhSachPhim')
    @ApiBearerAuth('AccessToken')
    async getListMovie(){
      return await this.movieService.getListMovie()
    }

    @Get('LayDanhSachPhimPhanTrang')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
      name: 'page',
      required: false,
      description: 'Nếu không truyền thì mặc định là 1',
      example: '1',
    })
     @ApiQuery({
        name: 'pageSize',
        required: false,
        description: 'Nếu không truyền thì mặc định là 3',
        example: '3',
    })
    @ApiQuery({
      name: 'search',
      required: false,
      description: 'Từ khóa tìm kiếm',
      example: 'Thám tử kiên',
    })
    async getListMoviePagination(
      @Query('page') page: string ,
      @Query('pageSize') pageSize: string,
      @Query('search') search: string
    ){
      const paginationDto: PaginationDto = {
        page,
        pageSize,
        search,
      };
      return this.movieService.getListMoviePagination(paginationDto)
    }

    @Get('LayThongTinPhim')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
      name: 'maPhim',
      required: true,
      description: 'Mã phim phải có 4 chữ số',
      example: '1280',
    })
    async getDetailMovie(
      @Query('maPhim') maPhim : string
    ){
      return this.movieService.getDetailMovie(maPhim)
    }


    @Delete('XoaPhim')
    @ApiBearerAuth('AccessToken')
    @ApiQuery({
      name: 'maPhim',
      required: true,
      description: 'Mã phim phải có 4 chữ số',
      example: '1280',
    })
    async deleteMovie(
      @Query('maPhim') maPhim : string
    ){
      return this.movieService.deleteMovie(maPhim)
    }


    @ApiBearerAuth('AccessToken')
    @Get('LayDanhSachBanner')
    async getListBanner(){
      return await this.movieService.getListBanner()
    }
}
