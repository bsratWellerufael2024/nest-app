import { IsNumber} from "class-validator";

export class ProductTransactionDTO{
    @IsNumber()
     productId:number

    @IsNumber()
     qty:number

    @IsNumber()
     unit_cost:number

     @IsNumber()
     unit_price:number
}