import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'vovanquoc0201' })
  taiKhoan: string;

  @IsOptional()
  @ApiProperty({ example: 'Võ Văn Quốc', required: false })
  hoTen?: string;

  @ApiProperty({ example: 'vovanquoc@example.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: '0909123456', required: false })
  soDt?: string;

  @IsOptional()
  @ApiProperty({ example: 'quoc1234', required: false })
  matKhau?: string;

  @IsOptional()
  @ApiProperty({ example: 'admin', required: false })
  loaiNguoiDung?: string;

  @IsOptional()
  @ApiProperty({ example: false, required: false })
  isDeleted?: boolean;
}
