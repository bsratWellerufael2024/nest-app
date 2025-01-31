import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductDto } from './product.dto';
import { ProductsService } from './products.service';
import { Products } from './product.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
@Controller('products')
export class ProductsController {
    constructor(private productService:ProductsService){}
    @Post()
    createProduct(@Body()productDto:ProductDto){
          return this.productService.createProduct(
            productDto.productId,
            productDto.productName,
            productDto.costPerUnit,
            productDto.specification,
            productDto.baseUnit,
            productDto.catagory,
            productDto.openingQty
          )
    }
     @Post('purchase/:id')
            newIncoming(@Param('id') id:number,@Body() productDto:ProductDto){
                  return this.productService.newIncoming(+id,productDto.inComingQty,productDto.costPerUnit)
      }
      @Post('sale/:id')
          newOutGoing(@Param('id') id:number,@Body() productDto:ProductDto){
               this.productService.newOutGoing(+id,productDto.outGoingQty ,productDto.sellingPricePerUnit)
           return {
             status: true,
             message: 'product saled successfuly',
           };
       }

     @Get('summary')
      async getInventorySummary(
      @Query('page') page=1,
      @Query('limit') limit=10,
      @Query('startDate') startDate?:string,
      @Query('endDate') endDate?:string,
      @Query('sortBy')   sortBy?:string
      ){
             let products=await this.productService.getInventorySummary(
               Number(page),
               Number(limit),
               startDate,
               endDate,
               sortBy
             )
            return{
                status:true,
                message:"product summary successfuly fetched",
                totalExependiture:products.totalExpenditue,
                totalRevenue:products.totalRevenue,
                profit:products.profit,
                products:products.processedProducts

             }
       }

    @Get(':id')
       getOneProduct(@Param('id') id:number){
        return this.productService.getOneProduct(+id)
       }
    @Put(":productid")
    updateProduct(@Param('productid') productid:number, @Body() updatedData:Partial<Products> ){
       return this.productService.updateProduct(+productid,updatedData)
    }


   @UseGuards(AuthGuard)
   @Roles(Role.Admin)
   @Delete(":productid")
    removeProduct(@Param('productid') productid:number){
        return this.productService.removeProduct(+productid)
    }
    
}
