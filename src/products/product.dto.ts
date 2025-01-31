import { isNumber, IsNumber, IsString, Length } from "class-validator"

export class ProductDto {
  @IsNumber()
  productId: number;

  @IsString()
  @Length(4)
  productName: string;

  @IsString()
  specification: string;

  @IsString()
  baseUnit: string;

  @IsNumber()
  openingQty: number;

  @IsNumber()
  inComingQty: number;

  @IsNumber()
  outGoingQty: number;

  @IsNumber()
  closingQty: number;

  catagory: string;

  @IsNumber()
  costPerUnit: number;

  @IsNumber()
  sellingPricePerUnit: number;
}