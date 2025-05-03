import { BadRequestException, Body, Controller, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AddMovieDto } from './Dto/addmovie-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
}
