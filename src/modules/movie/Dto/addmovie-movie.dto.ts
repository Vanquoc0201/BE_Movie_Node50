import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsDate,
    IsEnum
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { Type } from 'class-transformer';
  import { Movies_trangThai } from '@prisma/client';
  
  export class AddMovieDto {
    @IsString({ message: 'maPhim phải là chuỗi' })
    @IsNotEmpty({ message: 'maPhim không được để trống' })
    @ApiProperty({ example: '1284' })
    maPhim: string;
  
    @IsString({ message: 'tenPhim phải là chuỗi' })
    @IsNotEmpty({ message: 'tenPhim không được để trống' })
    @ApiProperty({ example: 'Đêm Thánh: Đội Săn Quỷ' })
    tenPhim: string;
  
    @IsString({ message: 'trailerPhim phải là chuỗi' })
    @IsNotEmpty({ message: 'trailerPhim không được để trống' })
    @ApiProperty({ example: 'https://www.youtube.com/watch?v=02pBCP84vSE' })
    trailerPhim: string;
  
    @IsString({ message: 'moTa phải là chuỗi' })
    @IsNotEmpty({ message: 'moTa không được để trống' })
    @ApiProperty({
      example:
        'Tổ đội săn lùng và tiêu diệt các thế lực tôn thờ quỷ dữ...',
    })
    moTa: string;
  
    @IsDate({ message: 'ngayKhoiChieu phải là định dạng ngày hợp lệ' })
    @Type(() => Date)
    @ApiProperty({ example: '2025-05-09' })
    ngayKhoiChieu: Date;
  
    @IsNumber(undefined, { message: 'danhGia phải là số' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'danhGia không được để trống' })
    @ApiProperty({ example: 7 })
    danhGia: number;
  
    @IsEnum(Movies_trangThai, {
        message: 'trangThai phải là một trong các giá trị: DangChieu, SapChieu, NgungChieu',
    })
    @ApiProperty({ example: 'DangChieu', enum: Movies_trangThai })
    trangThai: Movies_trangThai;
  
    @IsString({ message: 'dienVien phải là chuỗi' })
    @IsNotEmpty({ message: 'dienVien không được để trống' })
    @ApiProperty({ example: 'Ma Dong-seok, Seohyun, David Lee' })
    dienVien: string;
  
    @IsString({ message: 'quocGia phải là chuỗi' })
    @IsNotEmpty({ message: 'quocGia không được để trống' })
    @ApiProperty({ example: 'Hàn Quốc' })
    quocGia: string;

    @IsString({ message: 'theLoai phải là chuỗi' })
    @IsNotEmpty({ message: 'theLoai không được để trống' })
    @ApiProperty({ example: 'Hoạt hình, Phiêu Lưu' })
    theLoai: string;
  
    @IsNumber(undefined, { message: 'thoiLuong phải là số (phút)' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'thoiLuong không được để trống' })
    @ApiProperty({ example: 120 })
    thoiLuong: number;
  }
  