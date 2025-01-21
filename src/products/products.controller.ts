import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductDto } from './product.dto';
import { ProductsService } from './products.service';
import { Products } from './product.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('products')
export class ProductsController {
    constructor(private productService:ProductsService){}
    @Get()
    findAll(){
        return this.productService.getAllProducts()
    }

    @Post()
    createProduct(@Body()productDto:ProductDto){
          return this.productService.createProduct(
            productDto.productId,
            productDto.productName,
            productDto.price
          )
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
