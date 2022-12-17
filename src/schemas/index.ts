import { MongooseModule } from '@nestjs/mongoose';
import { MapFeatures, MapFeaturesSchema } from './mapFeatures.schema';
import { ParkingPoint, ParkingPointSchema } from './parkingPoint.schema';
import { SamplePoint, SamplePointSchema } from './samplePoint.schema';
import { User, UserSchema } from './user.schema';

export const AllSchemasModule = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: SamplePoint.name,
    schema: SamplePointSchema,
  },
  {
    name: ParkingPoint.name,
    schema: ParkingPointSchema,
  },
  {
    name: MapFeatures.name,
    schema: MapFeaturesSchema,
  },
]);
