import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJs from 'crypto-js';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { MpService } from './mp.service';

@Controller('mp')
export class MpController {
  constructor(
    private readonly configService: ConfigService,
    private readonly mpService: MpService,
  ) {}

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

  @Post('/user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.mpService.createUser(createUserDto);
  }

  @Get('/user')
  findAllUser() {
    return this.mpService.findAllUser();
  }
}
