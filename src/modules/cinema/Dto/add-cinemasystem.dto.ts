import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class addCinemaSystemDto {
    @IsString({ message: 'maHeThongRap phải là chuỗi' })
    @IsNotEmpty({ message: 'maHeThongRap không được để trống' })
    @ApiProperty({ example: '1800' })
    maHeThongRap: string;

    @IsString({ message: 'tenHeThongRap phải là chuỗi' })
    @IsNotEmpty({ message: 'tenHeThongRap không được để trống' })
    @ApiProperty({ example: 'Beta' })
    tenHeThongRap: string;
}