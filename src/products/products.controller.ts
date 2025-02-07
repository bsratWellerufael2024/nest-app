import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductDto } from './product.dto';
import { ProductsService } from './products.service';
import { Products } from './product.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Controller('products')
export class ProductsController {
    constructor(private productService:ProductsService){}

    @Post()
    async createProduct(@Body()productDto:ProductDto):Promise<ApiResponse<any>>{
      return await this.productService.createProduct(
            productDto.productName,
            productDto.costPerUnit,
            productDto.specification,
            productDto.baseUnit,
            productDto.categoryId,
            productDto.openingQty
          )
    }
      @UsePipes( new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        transform:false
      }))

     @Post('purchase/:id')
            async newIncoming(@Param('id') id:number,@Body() productDto:ProductDto):Promise<ApiResponse<any>>{
              return await this.productService.newIncoming(+id,productDto.inComingQty,productDto.costPerUnit)        
      }

     @Post('sale/:id')
         async newOutGoing(@Param('id') id:number,@Body() productDto:ProductDto){
            return  await this.productService.newOutGoing(+id,productDto.outGoingQty ,productDto.sellingPricePerUnit)
    
       }

     @Get('summary')
      async getInventorySummary(
      @Query('page') page=1,
      @Query('limit') limit=2,
      @Query('startDate') startDate?:string,
      @Query('endDate') endDate?:string,
      @Query('sortBy')   sortBy?:string
      )      {
      return await this.productService.getInventorySummary( Number(page),Number(limit),startDate,endDate,sortBy)
             
            // return{
               
                // totalExependiture:products.totalExpenditue,
                // totalRevenue:products.totalRevenue,
                // profit:products.profit,
                // products:products.processedProducts
                
            //  }
       }

    @Get(':id')
       getOneProduct(@Param('id') id:number){
        return this.productService.getOneProduct(+id)
       }
    @Put(":productid")
    updateProduct(@Param('productid') productid:number, @Body() updatedData:Partial<Products> ){
     this.productService.updateProduct(+productid,updatedData)
      return {
             message:"product succssfuly updated"
          }
    }
     
//   @Post('addCatagory')
//    async addCatagory(@Body() catagoryDto:CatagoryDto){
//            await this.productService.addCatagory(catagoryDto.id,catagoryDto.name,catagoryDto.description)
//             return {message:"catagory added"}
//    }
// @Get('getCatagory')
// async getCatagory(){
//    return await this.productService.getCatagory()
// }
   @UseGuards(AuthGuard)
   @Roles(Role.Admin)
   @Delete(":productid")
    removeProduct(@Param('productid') productid:number){
        return this.productService.removeProduct(+productid)
    }
    
}

