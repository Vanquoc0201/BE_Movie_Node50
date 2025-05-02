import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMovieDto } from './Dto/addmovie-movie.dto';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as path from 'path';
import * as fs from 'fs';
import { API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, CLOUD_NAME_CLOUDINARY } from 'src/common/constant/app.constant';
@Injectable()
export class MovieService {
    constructor (private readonly prismaService : PrismaService){}
    async addMovie(movieData: AddMovieDto ,file: Express.Multer.File) {
        cloudinary.config({
            cloud_name: CLOUD_NAME_CLOUDINARY,
            api_key: API_KEY_CLOUDINARY,
            api_secret: API_SECRET_CLOUDINARY,
        });
        const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'images' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                }
            );
            stream.end(file.buffer);
        });
        const movieToSave = {
            ...movieData,
            maPhim : +movieData.maPhim,
            hinhAnh: uploadResult.secure_url,
        };
        const movie = await this.prismaService.movies.create({
            data: movieToSave,
        })
        return {
            message: 'Thêm phim thành công',
            ...movie,
        }
    }
}
