import { Module } from '@nestjs/common';
import { AllSchemasModule } from 'src/schemas';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [AllSchemasModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
