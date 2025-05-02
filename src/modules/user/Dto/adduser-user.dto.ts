import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsIn } from "class-validator";
export class AdduserDto {
    @IsString({message : 'Tài khoản phải là chuỗi'})
    @IsNotEmpty({message : 'Tài khoản không được để trống'})
    @ApiProperty({example: 'nguyenvanb', description: 'Tài khoản người dùng'})
    taiKhoan : string;
    @IsString({message : 'Mật khẩu phải là chuỗi'})
    @IsNotEmpty({message : 'Mật khẩu không được để trống'})
    @ApiProperty({example: '123456', description: 'Mật khẩu người dùng'})

    matKhau : string;
    @IsString({message : 'Họ tên phải là chuỗi'})
    @IsNotEmpty({message : 'Họ tên không được để trống'})
    @ApiProperty({example: 'Nguyễn Văn B', description: 'Họ tên người dùng'})

    hoTen : string;
    @IsString({message : 'Email phải là chuỗi'})
    @IsNotEmpty({message : 'Email không được để trống'})
    @ApiProperty({example: 'nguyenvanb123@gmail.com', description: 'Email người dùng'})
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: 'Email không đúng định dạng',
    })
    email : string;
    @IsString({message : 'Số điện thoại phải là chuỗi'})
    @IsNotEmpty({message : 'Số điện thoại không được để trống'})
    @ApiProperty({example: '0123456789', description: 'Số điện thoại người dùng'})
    soDt : string;

    @IsString({message : 'maLoaiNguoiDung phải là chuỗi'})
    @IsNotEmpty({message : 'maLoaiNguoiDung không được để trống'})
    @IsIn(['KhachHang', 'QuanTriVien'], {
        message: 'loaiNguoiDung chỉ được là "KhachHang" hoặc "QuanTriVien"',
      })
    @ApiProperty({ example: 'KhachHang', description: 'Loại người dùng (KhachHang hoặc QuanTriVien)' })
    loaiNguoiDung : string;

}