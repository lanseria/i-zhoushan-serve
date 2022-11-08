import { MongooseModule } from '@nestjs/mongoose';
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
]);
