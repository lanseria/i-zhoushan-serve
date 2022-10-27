import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJs from 'crypto-js';
import got from 'got';
import {
  MP_SUBSCRIBE_message_subscribe_send,
  MP_TOKEN_token,
} from './sample/const';

@Injectable()
export class MpService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(MpService.name);
  /**
   * access_token 接口调用凭证
   * touser string openid
   * template_id 所需下发的订阅模板id
   * data 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }
   */
  async subscribeMessageSend(
    access_token: string,
    touser: string,
    template_id: string,
    page: string,
    data: any,
  ) {
    const res = await got.post(MP_SUBSCRIBE_message_subscribe_send, {
      searchParams: {
        access_token,
      },
      json: {
        touser,
        template_id,
        page,
        data,
      },
    });
    this.logger.debug(res.body);
    const body = JSON.parse(res.body);
    return body;
  }

  async token(): Promise<string> {
    const res = await got.get(MP_TOKEN_token, {
      searchParams: {
        appid: this.configService.get<string>('mp.appid'),
        secret: this.configService.get<string>('mp.secret'),
        grant_type: 'client_credential',
      },
    });
    this.logger.debug(res.body);
    const body = JSON.parse(res.body);
    return body.access_token;
  }

  checkSignature(signature: any, timestamp: any, nonce: any, echostr: any) {
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
