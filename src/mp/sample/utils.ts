import { IV, WordArray } from './const';
import * as CryptoJS from 'crypto-js';

export const encodeStr = (paramData: any) => {
  const w = CryptoJS.enc.Utf8.parse(WordArray);
  const O = CryptoJS.enc.Hex.parse(IV);
  let body =
    typeof paramData == 'string' ? paramData : JSON.stringify(paramData);
  body = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(body), w, {
    iv: O,
  }).toString();
  return body;
};

export const decodeStr = (data: string) => {
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
