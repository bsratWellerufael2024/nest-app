import { isNumber, IsNumber, IsString, Length } from "class-validator"

export class ProductDto{
    @IsNumber()
    productId:number

    @IsString()
    @Length(4)
    productName:string

    @IsNumber()
    price:number

}