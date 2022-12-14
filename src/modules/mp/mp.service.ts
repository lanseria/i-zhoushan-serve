import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJs from 'crypto-js';
import got from 'got';
import { BufferedFile } from 'src/common/interfaces';
import { FileService as MinioFileService } from '../file/file.service';
import {
  MpLoginDto,
  MpSubscribeMessageDto,
  MpTokenDto,
  MP_LOGIN_sns_jscode2session,
  MP_SUBSCRIBE_message_subscribe_send,
  MP_TOKEN_token,
} from '../../common/const';

@Injectable()
export class MpService {
  constructor(
    private readonly minioFileService: MinioFileService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MpService.name);
  /**
   * 上传图片
   * @param imageFile 文件二进制
   */
  async uploadImage(imageFile: BufferedFile) {
    const uploadImgUrl = await this.minioFileService.uploadFile(imageFile, [
      'jpeg',
      'jpg',
      'png',
      'gif',
      'webp',
    ]);
    return {
      image_url: uploadImgUrl.url,
      message: 'success',
    };
  }
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
    this.logger.debug('subscribe message: ' + res.body);
    const body: MpSubscribeMessageDto = JSON.parse(res.body);
    return body;
  }

  async login(code: string): Promise<MpLoginDto> {
    this.logger.debug('login code: ' + code);
    const res = await got.get(MP_LOGIN_sns_jscode2session, {
      searchParams: {
        appid: this.configService.get<string>('mp.appid'),
        secret: this.configService.get<string>('mp.secret'),
        js_code: code,
        grant_type: 'authorization_code',
      },
    });
    this.logger.debug('login data: ' + res.body);
    const body: MpLoginDto = JSON.parse(res.body);
    return body;
  }

  async token(): Promise<MpTokenDto> {
    const res = await got.get(MP_TOKEN_token, {
      searchParams: {
        appid: this.configService.get<string>('mp.appid'),
        secret: this.configService.get<string>('mp.secret'),
        grant_type: 'client_credential',
      },
    });
    this.logger.debug('access_token:' + res.body);
    const body: MpTokenDto = JSON.parse(res.body);
    return body;
  }

  checkSignature(signature: any, timestamp: any, nonce: any, echostr: any) {
    const mpToken = this.configService.get<string>('mp.token');
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
