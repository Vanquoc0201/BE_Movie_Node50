import { IsString, IsNotEmpty } from 'class-validator';
import { ApiQuery } from '@nestjs/swagger';

export class PaginationDto {
   @IsString({message: 'page phải là chuỗi'})
   @IsNotEmpty({ message: 'page không được để trống'})
   page: string | number ;

   @IsString({message: 'pageSize phải là chuỗi'})
   @IsNotEmpty({ message: 'pageSize không được để trống'})

   pageSize: string | number;
   @IsString({message: 'search phải là chuỗi'})

   search: string;
}