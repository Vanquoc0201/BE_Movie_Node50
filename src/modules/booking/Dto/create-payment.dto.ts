import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
class BuyerInfo {
  @ApiProperty()
  @IsString()
  taiKhoan: string;

  @ApiProperty()
  @IsString()
  hoTen: string;

  @ApiProperty()
  @IsString()
  soDt: string;
}
class Item {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number; 

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  returnUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @ApiProperty({ type: BuyerInfo })
  @ValidateNested()
  @Type(() => BuyerInfo)
  buyerInfo: BuyerInfo;

  @ApiProperty({ type: [Item] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}
