import { Module } from '@nestjs/common';
import { UnitconversionService } from './unitconversion.service';
import { UnitconversionController } from './unitconversion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitCoversion } from './unit.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UnitCoversion])],
  providers: [UnitconversionService],
  controllers: [UnitconversionController],
  exports:[UnitconversionService]
})
export class UnitconversionModule {}
