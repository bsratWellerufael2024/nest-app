import { IsNumber, IsString } from "class-validator";

export class CategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}