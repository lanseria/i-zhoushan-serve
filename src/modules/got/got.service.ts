import { Injectable } from '@nestjs/common';
import got from 'got';
import { SAMPLEHEADERS } from 'src/common/const';
@Injectable()
export class GotService {
  async getSamplePoint(body) {
    const res = await got.post(
      'https://hsddcx.wsjkw.zj.gov.cn/client-api/search/getNucleicAcidOrgList',
      {
        body,
        headers: SAMPLEHEADERS,
      },
    );
    return res;
  }
}
