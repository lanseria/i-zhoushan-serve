import { Injectable } from '@nestjs/common';
import got from 'got';
import * as CryptoJS from 'crypto-js';

const WordArray = 'LP6IRTBX';
const IV = '0102030405060708';

const parseData = (data: string) => {
  const w = CryptoJS.enc.Utf8.parse(WordArray);
  const T = CryptoJS.enc.Hex.parse(IV);
  const i = data.replace(/\s+/g, '');
  const base64 = CryptoJS.enc.Base64.parse(i);
  const res = CryptoJS.DES.decrypt(
    {
      ciphertext: base64,
    } as any,
    w,
    {
      iv: T,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString(CryptoJS.enc.Utf8);
  const resData = JSON.parse(res);
  return resData.result.t;
};
@Injectable()
export class SampleService {
  async getSampleV1(paramData: any) {
    const w = CryptoJS.enc.Utf8.parse(WordArray);
    const O = CryptoJS.enc.Hex.parse(IV);
    let body =
      typeof paramData == 'string' ? paramData : JSON.stringify(paramData);
    body = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(body), w, {
      iv: O,
    }).toString();
    const res = await got.post(
      'https://hsddcx.wsjkw.zj.gov.cn/client-api/search/getNucleicAcidOrgList',
      {
        body,
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'ali-version': '7.6.15',
          channel: 'H5',
          'content-type': 'application/json; charset=UTF-8',
          'sec-ch-ua':
            '"Chromium";v="106", "Microsoft Edge";v="106", "Not;A=Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-resp-encrypt': '1',
          cookie:
            'zh_choose_undefined=s; cna=mY3RG1dwbXQCAf////8KdmNX; ZJZWFWSESSIONID=62fe0943-2e4a-49f4-bc51-e52855a21288; cssstyle=1',
          Referer: 'https://hsddcx.wsjkw.zj.gov.cn/webapp/app-mobile/epidMap',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      },
    );
    const decodeBody = parseData(res.body);
    return decodeBody;
  }
}
