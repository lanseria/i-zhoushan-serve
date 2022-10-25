import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jhdh1j3h1jh3jk' })
  openid: string;

  @ApiProperty({ example: false })
  isSubscribe: boolean;

  @ApiProperty({ example: 1610536511 })
  currentSampleDateTime: number;

  @ApiProperty({ example: 3 })
  intervalDay: number;

  @ApiProperty({ example: 1610536590 })
  nextSampleDateTime: number;
}
