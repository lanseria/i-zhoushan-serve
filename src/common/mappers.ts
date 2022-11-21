import { SamplePoint } from 'src/schemas/samplePoint.schema';

export const samplePointDtosToMaps = (dto: SamplePoint) => {
  return {
    location: dto,
  };
};
