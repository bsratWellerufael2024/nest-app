import { IsNumber, IsString } from "class-validator";

export class CatagoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}