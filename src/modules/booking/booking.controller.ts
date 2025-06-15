import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BookingTicketDto } from './Dto/bookingticket.dto';
import { CreateShowtimeDto } from './Dto/createshowtime.dto';
import { CreatePaymentDto } from './Dto/create-payment.dto';

@Controller('QuanLyDatVe')
export class BookingController {
    constructor (private readonly bookingService : BookingService ){}
    @Get('LayDanhSachPhongVe')
    @ApiBearerAuth('AccessToken')
    async getListShowTimes(
        @Query('maLichChieu') maLichChieu : number
    ){
        return await this.bookingService.getListShowTimes(maLichChieu)
    }
    @Get('LayDanhSachRapTheoCumRap')
    @ApiBearerAuth('AccessToken')
    async getListCinemaByCluster() {
        return await this.bookingService.getListCinemaGroupedByCluster();
    }
    @Post('DatVe')
    @ApiBearerAuth('AccessToken')
    @ApiBody({ type: BookingTicketDto })
    async bookingTicket(
        @Body() body : BookingTicketDto,
        @Req() req : any
    ){  
        const taiKhoan = req.user?.taiKhoan
        return await this.bookingService.bookingTicket(body,taiKhoan)
    }
    @Post('TaoLichChieu')
    @ApiBearerAuth('AccessToken')
    async createShowTime(
        @Body() body : CreateShowtimeDto
    ){
        return await this.bookingService.createShowTime(body)
    }
    @ApiBearerAuth('AccessToken')
    @Post('TaoThanhToan')
    async createPayment(@Body() body : CreatePaymentDto){
        return await this.bookingService.createPayment(body);
    }
}
