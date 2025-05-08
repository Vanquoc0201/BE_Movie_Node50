import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsNumber, IsNotEmpty } from 'class-validator';

export class BookingTicketDto {
  @IsNumber(undefined, { message: 'maLichChieu phải là số' })
  @IsNotEmpty({ message: 'maLichChieu không được để trống' })
  @ApiProperty({ example: 1280211 })
  maLichChieu: number;

  @IsArray({ message: 'danhSachGhe phải là một mảng' })
  @ArrayNotEmpty({ message: 'danhSachGhe không được để trống' })
  @ApiProperty({ example: [1, 2, 3], description: 'Danh sách mã ghế muốn đặt' })
  danhSachGhe: number[];
}
