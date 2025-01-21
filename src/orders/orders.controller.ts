import { Controller, Get, Post, Req ,Headers, Res, Param, ParseIntPipe, HttpStatus, Query, ParseBoolPipe, UsePipes, ValidationPipe} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';


@Controller('orders')
export class OrdersController {
    constructor(private orderService:OrdersService){}
    @Get()
    findAll(@Req() req:Request){
        return {}
    }
    @Post()

    create(@Headers('authorization') authHeader:string){
        return authHeader
    }
     
//   @Get(':id')
//   findProductById(@Param('id',ParseIntPipe) id:number){
//     return this.orderService.findOne(+id)
//   }
  @Get('item')
  filiteredProducts(@Query('item',ParseBoolPipe)  isStocked:boolean){
     return this.orderService.filteredProducts(isStocked)
  }
}
