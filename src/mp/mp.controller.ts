import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as CryptoJs from 'crypto-js';
import { MpService } from './mp.service';

@ApiTags('小程序端')
@Controller('mp')
export class MpController {
  constructor(
    private readonly configService: ConfigService,
    private readonly mpService: MpService,
  ) {}
  /**
   * 订阅服务器校验
   */
  @ApiOperation({ description: '订阅服务器校验' })
  @Get('/check_signature')
  checkSignature(
    @Query('signature') signature,
    @Query('timestamp') timestamp,
    @Query('nonce') nonce,
    @Query('echostr') echostr,
  ) {
    const mpToken = this.configService.get<string>('MP_TOKEN');
    const tmpArr = CryptoJs.SHA1(
      [mpToken, timestamp, nonce].sort().join(''),
    ).toString();
    if (tmpArr === signature) {
      return echostr;
    } else {
      return false;
    }
  }
}
