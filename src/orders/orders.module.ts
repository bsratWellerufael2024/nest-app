import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AuthMiddleware } from 'src/auth.middleware';
import LanguageMiddleware from 'src/language.middleware';
import { LoggerMiddleware } from 'src/logger.middleware';
import { OrdersService } from './orders.service';
@Module({
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
       consumer 
              .apply(LoggerMiddleware)
              .forRoutes('orders')
               
  }
}
