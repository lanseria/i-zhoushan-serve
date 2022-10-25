import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'lanseria' })
  name: string;

  @ApiProperty({ example: 'lanseria' })
  openid: string;

  @ApiProperty({ example: false })
  isSubscribe: boolean;
}
