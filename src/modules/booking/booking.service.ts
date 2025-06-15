import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingTicketDto } from './Dto/bookingticket.dto';
import { CreateShowtimeDto } from './Dto/createshowtime.dto';
import { BookingDetails_trangThaiGhe } from '@prisma/client';
import { CreatePaymentDto } from './Dto/create-payment.dto';
import * as crypto from 'crypto';
import { PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_CLIENT_ID } from 'src/common/constant/app.constant';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class BookingService {
    constructor (private readonly prismaService : PrismaService,private readonly httpService: HttpService){}
    async getListShowTimes(maLichChieu : number){
        const lichChieu = await this.prismaService.showtimes.findUnique({
            where : {maLichChieu : +maLichChieu},
            select :{
                maRap: true,
                ngayGioChieu : true,
                maPhim : true,
                giaVe : true
            }
        })
        if(!lichChieu) { throw new BadRequestException('Mã lịch chiếu không tồn tại')}
        if(!lichChieu?.maPhim) { throw new BadRequestException('Lịch chiếu không có mã phim')}
        const movie = await this.prismaService.movies.findUnique({
            where : { maPhim : lichChieu.maPhim},
            select : {
                tenPhim : true,
                hinhAnh : true,
                trailerPhim : true,
                moTa : true,
                ngayKhoiChieu : true
            }
        })
        const danhSachGhe = await this.prismaService.chairs.findMany({
            where : { maRap : lichChieu.maRap}
        })
        const danhSachChiTietGhe = await this.prismaService.bookingDetails.findMany({
          where: {
            Bookings: {
              maLichChieu: +maLichChieu
            }
          },
          select: {
            maGhe: true,
            trangThaiGhe: true
          }
        });
        const mapGheTrangThai = new Map<number, string>();
        for (const ghe of danhSachChiTietGhe) {
          mapGheTrangThai.set(ghe.maGhe, ghe.trangThaiGhe ?? 'Trong');
        }

        const gheCuoi = danhSachGhe.map((ghe) => ({
          ...ghe,
          trangThai: mapGheTrangThai.get(ghe.maGhe) || 'Trong' 
        }));
        return {
            maLichChieu,
            ngayGioChieu : lichChieu.ngayGioChieu,
            giaVe : lichChieu.giaVe,
            movie,
            danhSachGhe : gheCuoi
        }
    }
    async getListCinemaGroupedByCluster() {
      return await this.prismaService.cinemaCluster.findMany({
        include: {
          Cinema: {
            select: {
              maRap: true,
              tenRap: true,
            },
          },
        },
      });
    }
    async bookingTicket(body: BookingTicketDto, taiKhoan: string) {
        const { maLichChieu, danhSachGhe } = body;
        const isValidSchedule = await this.prismaService.showtimes.findUnique({
          where: { maLichChieu },
        });
        if (!isValidSchedule) {
          throw new BadRequestException('Mã lịch chiếu không tồn tại');
        }
        for (const maGhe of danhSachGhe) {
          const chair = await this.prismaService.chairs.findUnique({
            where: { maGhe },
          });
          if (!chair) {
            throw new BadRequestException(`Ghế ${maGhe} không tồn tại`);
          }
          if (chair.maRap !== isValidSchedule.maRap) {
            throw new BadRequestException(`Ghế ${maGhe} không thuộc rạp của lịch chiếu`);
          }
          const isBooked = await this.prismaService.bookingDetails.findFirst({
            where: {
              maGhe, 
              isDeleted: false, 
            },
          });
          if (isBooked) {
            throw new BadRequestException(`Ghế ${maGhe} đã được đặt`);
          }
        }
        const booking = await this.prismaService.bookings.create({
          data: {
            taiKhoan,
            maLichChieu,
            createdAt: new Date(),
          },
        });
        const bookingId = booking.bookingId;
        const bookingDetails = danhSachGhe.map((maGhe) => ({
          maBooking : bookingId,
          maGhe,
          trangThaiGhe: 'DangDat' as BookingDetails_trangThaiGhe, 
        }));
        await this.prismaService.bookingDetails.createMany({
          data: bookingDetails,
        });
        return {
          message: 'Đặt vé thành công',
          booking,
          gheDaDat: danhSachGhe,
        };
    }
    async createShowTime(body : CreateShowtimeDto){
        const { maPhim, maRap, ngayGioChieu, giaVe } = body;
        const phim = await this.prismaService.movies.findUnique({ where: { maPhim } });
        if (!phim) {
            throw new BadRequestException('Mã phim không tồn tại');
        }
        const rap = await this.prismaService.cinema.findUnique({ where: { maRap } });
        if (!rap) {
            throw new BadRequestException('Mã rạp không tồn tại');
        }
        const maLichChieu = +(`${body.maPhim}${body.maRap}`);
        const newShowtime = await this.prismaService.showtimes.create({
            data : {
                maLichChieu: maLichChieu,
                maPhim : body.maPhim,
                maRap : body.maRap,
                ngayGioChieu : new Date(body.ngayGioChieu),
                giaVe : body.giaVe
            }
        });
        return {
            message: 'Tạo lịch chiếu thành công',
            data: newShowtime,
        };
    }
    async createPayment(data: CreatePaymentDto) {
      const orderCode = Date.now();
      const rawSignature = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${orderCode}&returnUrl=${data.returnUrl}`;
      const signature = crypto
        .createHmac('sha256', PAYOS_CHECKSUM_KEY as string)
        .update(rawSignature)
        .digest('hex');
      const payload = {
        orderCode,
        amount: data.amount,
        description: data.description,
        returnUrl: data.returnUrl,
        cancelUrl: data.cancelUrl,
        buyerName: data.buyerInfo.hoTen,
        buyerAccount: data.buyerInfo.taiKhoan,
        buyerPhone: data.buyerInfo.soDt,
        items: data.items,
        signature,
      };

      const res = await this.httpService.axiosRef.post(
        'https://api-merchant.payos.vn/v2/payment-requests',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': PAYOS_CLIENT_ID,
            'x-api-key': PAYOS_API_KEY,
          },
        },
      );
    return res.data;
  }
}
