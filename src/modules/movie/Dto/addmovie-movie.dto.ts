import { IsString, IsNotEmpty, IsNumber, Matches, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddMovieDto {
   @IsString({message: 'maPhim phải là chuỗi'})
   @IsNotEmpty({ message: 'maPhim không được để trống'})
  @ApiProperty({ example: '1284' })
   maPhim: string;

   @IsString({message: 'tenPhim phải là chuỗi'})
   @IsNotEmpty({ message: 'tenPhim không được để trống'})
  @ApiProperty({ example: 'Đêm Thánh: Đội Săn Quỷ' })
   tenPhim: string;

   @IsString({message: 'trailerPhim phải là chuỗi'})
   @IsNotEmpty({ message: 'trailerPhim không được để trống'})
  @ApiProperty({ example: 'https://www.youtube.com/watch?v=02pBCP84vSE' })
   trailerPhim: string;

   @IsString({message: 'moTa phải là chuỗi'})
   @IsNotEmpty({ message: 'moTa không được để trống'})
  @ApiProperty({ example: 'Tổ đội săn lùng và tiêu diệt các thế lực tôn thờ quỷ dữ với những sức mạnh siêu nhiên khác nhau gồm “tay đấm” Ma Dong-seok, Seohuyn (SNSD) và David Lee hứa hẹn mở ra cuộc chiến săn quỷ khốc liệt nhất dịp lễ 30/4 này!' })
   moTa: string;

   @IsDate({ message: 'ngayKhoiChieu phải là định dạng ngày hợp lệ' })
    @Type(() => Date) 
    @ApiProperty({ example: '2025-05-09' })
    ngayKhoiChieu: Date;

    @IsNumber(undefined,{message: 'danhGia phải là số'})
    @Type(() => Number)
    @IsNotEmpty({ message: 'danhGia không được để trống'})
   @ApiProperty({ example: 7 })
    danhGia: number;

    @IsBoolean({message: 'hot phải là boolean'})
    @Type(() => Boolean)
    @IsNotEmpty({ message: 'hot không được để trống'})
   @ApiProperty({ example: true })
    hot: boolean;

    @IsBoolean({message: 'dangChieu phải là boolean'})
    @Type(() => Boolean)
    @IsNotEmpty({ message: 'dangChieu không được để trống'})
   @ApiProperty({ example: false })
    dangChieu: boolean;

    @IsBoolean({message: 'sapChieu phải là boolean'})
    @Type(() => Boolean)
    @IsNotEmpty({ message: 'sapChieu không được để trống'})
   @ApiProperty({ example: true })
    sapChieu: boolean;
}
