import { isNumber, IsNumber, IsString, Length } from "class-validator"

export class ProductDto{
    @IsNumber()
    productId:number

    @IsString()
    @Length(4)
    productName:string

    @IsString()
    specification:string

    @IsString()
    unit:string

    @IsNumber()
    qty:number

    catagory:string

    @IsNumber()
    price:number
    

}