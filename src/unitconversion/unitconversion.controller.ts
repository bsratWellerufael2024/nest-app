import { Body, Controller, Get, Param ,Post} from '@nestjs/common';
import { UnitconversionService } from './unitconversion.service';

@Controller('unitconversion')
export class UnitconversionController {
    constructor(private unitConversionService:UnitconversionService){}

    @Get('suggest/:baseUnit')
     async getSuggetion(@Param('baseUnit') baseUnit:string){
            return await this.unitConversionService.getSuggestions(baseUnit)
     }
      
     @Post('add')
     async addConversionRete(@Body() body:{baseUnit:string,containerUnit:string,conversionRate:number})
     {
          return await this.unitConversionService.addOrUpdateConversion(
            body.baseUnit,
            body.containerUnit,
            body.conversionRate)
     }
}
