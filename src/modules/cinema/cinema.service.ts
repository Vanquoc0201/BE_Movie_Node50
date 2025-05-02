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
}
