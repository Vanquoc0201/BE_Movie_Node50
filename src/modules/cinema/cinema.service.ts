import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
