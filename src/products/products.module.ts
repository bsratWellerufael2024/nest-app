import { MiddlewareConsumer, Module,NestModule, RequestMethod } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductMiddleware } from 'src/product.middleware';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './product.entity';
import { UnitconversionModule } from 'src/unitconversion/unitconversion.module';
import { Category } from './category.entity';
import { ProductTransaction } from './product.transaction.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Products,Category,ProductTransaction]),UnitconversionModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule implements NestModule{
   configure(consumer: MiddlewareConsumer) {
             consumer 
                     .apply(ProductMiddleware)
                     .forRoutes({path:'/products', method:RequestMethod.POST})
   }
}
