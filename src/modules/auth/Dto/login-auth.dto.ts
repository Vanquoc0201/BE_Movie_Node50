import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
   @IsOptional()
   @IsString({message: 'userId phải là chuỗi'})
   userId : string;

   @IsString({message: 'Tài khoản phải là chuỗi'})
   @IsNotEmpty({ message: 'Tài khoản không được để trống'})
    @ApiProperty({ example: 'quocvovan0201' })
   taiKhoan: string;
   @IsString({message: 'Mật khẩu phải là chuỗi'})
   @IsNotEmpty({ message: 'Mật khẩu không được để trống'})
  @ApiProperty({ example: 'vanquoc020106' })
   matKhau: string;
}