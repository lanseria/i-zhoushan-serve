import { Injectable } from '@nestjs/common';
import got from 'got';
import { decodeStr, encodeStr } from './utils';
import { SampleHeaders } from './const';

@Injectable()
export class SampleService {
  async getSampleV1(paramData: any) {
    const body = encodeStr(paramData);
    const res = await got.post(
      'https://hsddcx.wsjkw.zj.gov.cn/client-api/search/getNucleicAcidOrgList',
      {
        body,
        headers: SampleHeaders,
      },
    );
    const decodeBody = decodeStr(res.body);
    return decodeBody;
  }
}
