import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingTicketDto } from './Dto/bookingticket.dto';
import { CreateShowtimeDto } from './Dto/createshowtime.dto';
import { BookingDetails_trangThaiGhe } from '@prisma/client';

@Injectable()
export class BookingService {
    constructor (private readonly prismaService : PrismaService){}
    async getListShowTimes(maLichChieu : number){
        const lichChieu = await this.prismaService.showtimes.findUnique({
            where : {maLichChieu : +maLichChieu},
            select :{
                maRap: true,
                ngayGioChieu : true,
                maPhim : true
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
        const gheDaDat = await this.prismaService.bookings.findMany({
            where : {maLichChieu : +maLichChieu},
            select: {
                maGhe : true
            }
        })
        const danhSachMaGheDaDat = gheDaDat.map(g => g.maGhe);
        const resultGhe = danhSachGhe.map(ghe => ({
            ...ghe,
            daDat: danhSachMaGheDaDat.includes(ghe.maGhe)
        }));
        return {
            maLichChieu,
            ngayGioChieu : lichChieu.ngayGioChieu,
            movie,
            danhSachGhe : resultGhe
        }
    }
    async bookingTicket(body: BookingTicketDto, taiKhoan: string) {
        const { maLichChieu, danhSachGhe } = body;
      
        // Kiểm tra mã lịch chiếu
        const isValidSchedule = await this.prismaService.showtimes.findUnique({
          where: { maLichChieu },
        });
        if (!isValidSchedule) {
          throw new BadRequestException('Mã lịch chiếu không tồn tại');
        }
      
        // Kiểm tra tính hợp lệ của các ghế
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
      
          // Kiểm tra ghế đã được đặt chưa trong booking này
          const isBooked = await this.prismaService.bookingDetails.findFirst({
            where: {
              maGhe, // Kiểm tra mã ghế
              isDeleted: false, // Kiểm tra ghế chưa bị xóa mềm
            },
          });
          if (isBooked) {
            throw new BadRequestException(`Ghế ${maGhe} đã được đặt`);
          }
        }
      
        // Tạo booking chính
        const booking = await this.prismaService.bookings.create({
          data: {
            taiKhoan,
            maLichChieu,
            createdAt: new Date(),
          },
        });
      
        // Lấy maBooking từ booking vừa tạo
        const bookingId = booking.bookingId;
      
        // Tạo các bookingDetail cho từng ghế
        const bookingDetails = danhSachGhe.map((maGhe) => ({
          maBooking : bookingId, // Liên kết với booking chính
          maGhe, // Ghế đã chọn
          trangThaiGhe: 'DangDat' as BookingDetails_trangThaiGhe, // Trạng thái ghế khi vừa được đặt
        }));
      
        // Lưu các chi tiết đặt vé vào bảng BookingDetails
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
}
