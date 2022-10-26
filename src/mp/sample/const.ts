export const WordArray = 'LP6IRTBX';
export const IV = '0102030405060708';
export const SampleHeaders = {
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
};
/**
 * 小程序登录
 * https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
 * GET https://api.weixin.qq.com/sns/jscode2session
 * appid	string	是	小程序 appId
 * secret	string	是	小程序 appSecret
 * js_code	string	是	登录时获取的 code，可通过wx.login获取
 * grant_type	string	是	授权类型，此处只需填写 authorization_code
 */
export const MP_LOGIN_sns_jscode2session =
  'https://api.weixin.qq.com/sns/jscode2session';
