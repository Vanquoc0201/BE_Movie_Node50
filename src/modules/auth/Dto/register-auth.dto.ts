import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
export class RegisterDto {
    @IsString({message : 'Tài khoản phải là chuỗi'})
    @IsNotEmpty({message : 'Tài khoản không được để trống'})
    @ApiProperty({example: 'nguyenvana123', description: 'Tài khoản của bạn'})
    taiKhoan : string;
    @IsString({message : 'Mật khẩu phải là chuỗi'})
    @IsNotEmpty({message : 'Mật khẩu không được để trống'})
    @ApiProperty({example : '123456', description: 'Mật khẩu của bạn'})

    matKhau : string;
    @IsString({message : 'Họ tên phải là chuỗi'})
    @IsNotEmpty({message : 'Họ tên không được để trống'})
    @ApiProperty({example : 'Nguyễn Văn A', description: 'Họ tên của bạn'})

    hoTen : string;
    @IsString({message : 'Email phải là chuỗi'})
    @IsNotEmpty({message : 'Email không được để trống'})
    @ApiProperty({example : 'nguyevana123@gmail.com', description: 'Email của bạn'})
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: 'Email không đúng định dạng',
    })

    email : string;
    @IsString({message : 'Số điện thoại phải là chuỗi'})
    @IsNotEmpty({message : 'Số điện thoại không được để trống'})
    @ApiProperty({example : '0123456789', description: 'Số điện thoại của bạn'})

    soDt : string;
}