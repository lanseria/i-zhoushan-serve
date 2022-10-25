import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJs from 'crypto-js';

@Controller('mp')
export class MpController {
  constructor(private readonly configService: ConfigService) {}

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
    console.log(signature, timestamp, nonce, mpToken, tmpArr);
    if (tmpArr === signature) {
      return echostr;
    } else {
      return false;
    }
  }
}
