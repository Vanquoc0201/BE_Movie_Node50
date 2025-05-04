import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class BookingTicketDto {
  @IsNumber(undefined,{message : 'maLichChieu phải là số'})
  @IsNotEmpty({message: 'maLichChieu không được để trống'})
  @ApiProperty({example : 1280211})
  maLichChieu: number;

  @IsNumber(undefined,{message: 'maGhe phải là số'})
  @IsNotEmpty({message: 'maGhe không được để trống'})
  @ApiProperty({example : 1})
  maGhe: number;
}