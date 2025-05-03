import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMovieDto } from './Dto/addmovie-movie.dto';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, CLOUD_NAME_CLOUDINARY } from 'src/common/constant/app.constant';
import { PaginationDto } from '../user/Dto/pagination-user.dto';
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
    async getListMovie(){
        const listMovie = await this.prismaService.movies.findMany();
        return {
            message : 'Lấy danh sách phim thành công',
            data : listMovie
        }
    }
    async getListMoviePagination(paginationDto : PaginationDto){
        let { page, pageSize , search } = paginationDto;
        page = +page > 0 ? +page : 1;
        pageSize = +pageSize > 0 ? +pageSize : 3;
        search = search || ``;
        const skip = (page - 1) * pageSize;
        const where = { tenPhim: { contains: search } };
        const movies = await this.prismaService.movies.findMany({
            skip: skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            where: where,
        });
        if(!movies.length){
            throw new BadRequestException('Không tìm thấy phim nào');
        }
        const totalItem = await this.prismaService.movies.count({
            where: where,
          });
        const totalPage = Math.ceil(totalItem / pageSize);
        return {
            page: page,
            pageSize: pageSize,
            totalItem: totalItem,
            totalPage: totalPage,
            items: movies || [],
        };
    }
    async getDetailMovie(maPhim : string){
        const existMovie = await this.prismaService.movies.findUnique({
            where : { maPhim : +maPhim}
        })
        if(!existMovie){
            throw new BadRequestException('Mã phim không tồn tại')
        }
        const detailMovie = await this.prismaService.movies.findFirst({
            where : {maPhim : +maPhim}
        })
        return {
            message : 'Lấy thông tin phim thành công',
            data : detailMovie
        }
    }
    async deleteMovie(maPhim : string){
        const movieId = +maPhim;

        const existMovie = await this.prismaService.movies.findUnique({
            where: { maPhim: movieId },
        });
    
        if (!existMovie) {
            throw new BadRequestException('Mã phim không tồn tại');
        }
        const hasShowtimes = await this.prismaService.showtimes.findFirst({
            where: { maPhim: movieId },
        });
    
        if (hasShowtimes) {
            throw new BadRequestException('Phim còn suất chiếu, không thể xóa');
        }
    
        const movieDelete = await this.prismaService.movies.delete({
            where: { maPhim: movieId },
        });
    
        return {
            message: 'Xóa phim thành công',
            data: movieDelete,
        };
    }
    async getListBanner(){
        const listBanner = await this.prismaService.banners.findMany();
        return {
            message : 'Lấy danh sách Banner thành công',
            data : listBanner
        }
    }
    
}
