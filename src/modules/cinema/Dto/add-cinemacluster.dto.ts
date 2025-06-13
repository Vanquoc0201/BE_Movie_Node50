import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class addCinemaClusterDto {
    @IsString({ message: 'maCumRap phải là chuỗi' })
    @IsNotEmpty({ message: 'maCumRap không được để trống' })
    @ApiProperty({ example: '1810' })
    maCumRap: string;

    @IsString({ message: 'maHeThongRap phải là chuỗi' })
    @IsNotEmpty({ message: 'maHeThongRap không được để trống' })
    @ApiProperty({ example: '1800' })
    maHeThongRap: string;

    @IsString({ message: 'tenCumRap phải là chuỗi' })
    @IsNotEmpty({ message: 'tenCumRap không được để trống' })
    @ApiProperty({ example: 'Beta Cinemas Quang Trung' })
    tenCumRap: string;

    @IsString({ message: 'diaChi phải là chuỗi' })
    @IsNotEmpty({ message: 'diaChi không được để trống' })
    @ApiProperty({ example: '647 Đ. Quang Trung, Phường 11, Gò Vấp, Hồ Chí Minh'})
    diaChi: string;
}