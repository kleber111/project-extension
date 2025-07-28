import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;
}
