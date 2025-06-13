import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addCinemaSystemDto } from './Dto/add-cinemasystem.dto';
import { API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, CLOUD_NAME_CLOUDINARY } from 'src/common/constant/app.constant';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { addCinemaClusterDto } from './Dto/add-cinemacluster.dto';

@Injectable()
export class CinemaService {
    constructor(private readonly prismaService : PrismaService){}
    async getCinemaSystem(){
        const cinemaSystem =  await this.prismaService.cinemaSystem.findMany({})
        return {
            message: 'Lấy thông tin hệ thống rạp thành công',
            data: cinemaSystem,
        }
    }
    async addCinemaSystem(cinemaData : addCinemaSystemDto, file: Express.Multer.File){
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
        const cinemaSystemToSave = {
            ...cinemaData,
            maHeThongRap : +cinemaData.maHeThongRap,
             logo : uploadResult.secure_url,
        }
        const cinemaSystem = await this.prismaService.cinemaSystem.create({
            data : cinemaSystemToSave
        })
        return {
            message: 'Thêm hệ thống rạp thành công',
            ...cinemaSystem,
        }
    }
    async getCinemaCluster(maHeThongRap : number){
        const existCinemaCluster = await this.prismaService.cinemaSystem.findUnique({
            where : {
                maHeThongRap : +maHeThongRap,
            }
        })
        if(!existCinemaCluster){
            throw new BadRequestException('maHeThongRap không tồn tại')
        }
        const cinemaClusterList = await this.prismaService.cinemaCluster.findMany({
            where : {
                maHeThongRap: +maHeThongRap,
            }
        })
        return {
            message: 'Lấy thông tin cụm rạp thành công',
            data: cinemaClusterList,
        };
    }
    async addCinemaCluster(body : addCinemaClusterDto){
        const {maHeThongRap} = body;
        const existingCluster = await this.prismaService.cinemaSystem.findUnique({
            where : {maHeThongRap : +maHeThongRap}
        });
        if(!existingCluster) throw new BadRequestException('Mã hệ thống rạp không tồn tại');
        const duplicate = await this.prismaService.cinemaCluster.findFirst({
            where: {
                tenCumRap: body.tenCumRap,
                maHeThongRap: +maHeThongRap
            }
        });
        if (duplicate) throw new BadRequestException('Tên cụm rạp đã tồn tại trong hệ thống này');
        const newCluster = await this.prismaService.cinemaCluster.create({
            data: {
            ...body,
            maHeThongRap: +maHeThongRap,
            maCumRap : +body.maCumRap
            },
        });
        return {
            message: 'Thêm cụm rạp trong hệ thống rạp thành công',
            ...newCluster,
        }
    }
    async deleteCinemaCluster(maCumRap : number){
        const cluster = await this.prismaService.cinemaCluster.findUnique({
            where : {maCumRap : +maCumRap}
        })
        if(!cluster) throw new BadRequestException('Cụm rạp này không tồn tại trong hệ thống')
        await this.prismaService.cinemaCluster.delete({
            where : {maCumRap : +maCumRap}
        })
        return {
            message: 'Xóa cụm rạp dùng thành công',
            ...cluster,
        };
    }
    async getShowTimesByCinemaCluster(maHeThongRap:number){       
        const existCluster = await this.prismaService.cinemaSystem.findUnique({
            where: {
                maHeThongRap: +maHeThongRap,
            },
        });
        
        if (!existCluster) {
            throw new BadRequestException('Mã hệ thống rạp không tồn tại');
        }
         // 2. Tìm tất cả các cụm rạp thuộc hệ thống rạp
        const clusters = await this.prismaService.cinemaCluster.findMany({
            where: { maHeThongRap: +maHeThongRap },
            select: { maCumRap: true }, // Chỉ chọn maCumRap
        });

        // Nếu không có cụm rạp nào thuộc hệ thống này, trả về mảng rỗng
        const cumRapIds = clusters.map(cluster => cluster.maCumRap);
        if (cumRapIds.length === 0) {
            return []; // Không có cụm rạp => không có lịch chiếu
        }

        // 3. Tìm tất cả các rạp chiếu thuộc các cụm rạp này
        const theaters = await this.prismaService.cinema.findMany({
            where: { maCumRap: { in: cumRapIds } },
            select: { maRap: true }, // Chỉ chọn maRap
        });

        const maRapList = theaters.map(rap => rap.maRap);
        if (maRapList.length === 0) {
            return []; // Không có rạp chiếu nào
        }

        // 4. Lấy tất cả lịch chiếu theo danh sách maRap
        const showtimes = await this.prismaService.showtimes.findMany({
            where: {
                maRap: { in: maRapList },
            },
        });

        // 5. Trả về kết quả
        return {
            maHeThongRap,
            cumRaps: cumRapIds.length,  // Số lượng cụm rạp
            rapCount: maRapList.length, // Số lượng rạp
            showtimes,                 // Danh sách lịch chiếu
        };
    }
    async getShowTimesByMovies(maPhim : number){
        const movie = await this.prismaService.movies.findUnique({
            where : { maPhim : +maPhim}
        })
        if(!movie){
            throw new BadRequestException('Mã phim không tồn tại')
        }
        const showtimes = await this.prismaService.showtimes.findMany({
            where : {maPhim : +maPhim},
            include : {
                Cinema : {
                    select: {
                        maRap : true,
                        tenRap : true,
                        CinemaCluster : {
                            select : {
                                maCumRap: true,
                                tenCumRap: true,
                                CinemaSystem : {
                                    select : {
                                        maHeThongRap : true,
                                        tenHeThongRap : true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        return {
            maPhim,
            tenPhim : movie.tenPhim,
            soLuongLichChieu : showtimes.length,
            lichChieu : showtimes.map(show => ({
                maLichChieu : show.maLichChieu,
                ngayGioChieu : show.ngayGioChieu,
                rap : show.Cinema?.tenRap,
                cumRap : show.Cinema?.CinemaCluster?.tenCumRap,
                heThongRap : show.Cinema?.CinemaCluster?.CinemaSystem?.tenHeThongRap,
            }))
        }
    }
}
