import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import  {DocumentBuilder,SwaggerModule} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
    app.enableCors()
    const config = new DocumentBuilder()
                    .setTitle('Stock and Inventory')
                    .setDescription('Stock and Inventory Api Specification')
                    .setVersion('1.0')
                    .addTag('stock')
                    .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory, {
      jsonDocumentUrl: 'swagger/json',
    });
  await app.listen(process.env.PORT??3000);
}
bootstrap()