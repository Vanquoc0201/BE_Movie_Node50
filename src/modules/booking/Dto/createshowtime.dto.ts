import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber(undefined, {message : 'maPhim phải là số'})
  @IsNotEmpty({message : 'maPhim không được để trống'})
  @ApiProperty({example : 1200})
  maPhim: number;

  @IsNumber(undefined, {message : 'maRap phải là số'})
  @IsNotEmpty({message : 'maRap không được để trống'})
  @ApiProperty({example : 211})
  maRap: number;

  @IsString({message : 'ngaygioChieu phải là dạng date'})
  @IsNotEmpty({message : 'ngayGioChieu không được để trống'})
  @ApiProperty({example : '2025-05-02T15:00:00Z'})
  ngayGioChieu: string;

  @IsNumber(undefined, {message : 'giaVe phải là số'})
  @IsNotEmpty({message : 'giaVe không được để trống'})
  @ApiProperty({example : 70000})
  giaVe: number;
}
