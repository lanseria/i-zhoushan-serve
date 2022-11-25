import { IV, WordArray } from './const';
import * as CryptoJS from 'crypto-js';
import * as coordtransform from 'coordtransform';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

/**
 * 加密
 * @param paramData 未加密数据
 * @returns 加密数据
 */
const encodeStr = (paramData: any) => {
  const w = CryptoJS.enc.Utf8.parse(WordArray);
  const O = CryptoJS.enc.Hex.parse(IV);
  let body =
    typeof paramData == 'string' ? paramData : JSON.stringify(paramData);
  body = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(body), w, {
    iv: O,
  }).toString();
  return body;
};
/**
 * 解密
 * @param data 加密数据
 * @returns 解密数据
 */
const decodeStr = (data: string) => {
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

const wgs842gcj02 = (coordinates) => {
  return coordtransform.wgs842gcj02(coordinates[0], coordinates[1]);
};

const gcj02towgs84 = (coordinates) => {
  return coordtransform.gcj02towgs84(coordinates[0], coordinates[1]);
};

export { dayjs, gcj02towgs84, wgs842gcj02, encodeStr, decodeStr };
