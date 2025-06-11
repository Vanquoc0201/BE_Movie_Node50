import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @ApiProperty({ example: 'nguyenvanb', description: 'Tài khoản người dùng' })
  taiKhoan: string;

  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @ApiPropertyOptional({ example: 'Nguyễn Văn B', description: 'Họ tên người dùng' })
  hoTen?: string;

  @IsOptional()
  @IsString({ message: 'Email phải là chuỗi' })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email không đúng định dạng',
  })
  @ApiPropertyOptional({ example: 'nguyenvanb123@gmail.com', description: 'Email người dùng' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @ApiPropertyOptional({ example: '0123456789', description: 'Số điện thoại người dùng' })
  soDt?: string;

  @IsOptional()
  @IsString({ message: 'maLoaiNguoiDung phải là chuỗi' })
  @IsIn(['KhachHang', 'QuanTriVien'], {
    message: 'loaiNguoiDung chỉ được là "KhachHang" hoặc "QuanTriVien"',
  })
  @ApiPropertyOptional({ example: 'KhachHang', description: 'Loại người dùng (KhachHang hoặc QuanTriVien)' })
  loaiNguoiDung?: string;
}
