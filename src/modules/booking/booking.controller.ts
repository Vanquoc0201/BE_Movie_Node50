import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BookingTicketDto } from './Dto/bookingticket.dto';
import { CreateShowtimeDto } from './Dto/createshowtime.dto';

@Controller('Booking')
export class BookingController {
    constructor (private readonly bookingService : BookingService ){}
    @Get('LayDanhSachPhongVe')
    @ApiBearerAuth('AccessToken')
    async getListShowTimes(
        @Query('maLichChieu') maLichChieu : number
    ){
        return await this.bookingService.getListShowTimes(maLichChieu)
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


}
