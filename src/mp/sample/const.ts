export const WordArray = 'LP6IRTBX';
export const IV = '0102030405060708';
export const SAMPLEHEADERS = {
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
export const SAMPLE_SUBSCRIBE_TEMPLATE_ID =
  'rloHiweZ2j-enAm6lNUwIuIjl3bEIWyZpvG-5Nvk9D0';
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
export interface MpLoginDto {
  session_key: string;
  openid: string;
}
/**
 * 接口调用凭证 /getAccessToken
 * auth.getAccessToken
 * grant_type	string		是	填写 client_credential
 * appid	string		是	小程序唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
 * secret	string		是	小程序唯一凭证密钥，即 AppSecret，获取方式同 appid
 */
export const MP_TOKEN_token = 'https://api.weixin.qq.com/cgi-bin/token';
export interface MpTokenDto {
  access_token: string;
  expires_in: string;
}
/**
 * 订阅消息 /send
 * POST https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=ACCESS_TOKEN
 * access_token / cloudbase_access_token	string		是	接口调用凭证
 * touser	string		是	接收者（用户）的 openid
 * template_id	string		是	所需下发的订阅模板id
 * page	string		否	点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
 * data	Object		是	模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }
 * miniprogram_state	string		否	跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
 * lang	string		否	进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
 */
export const MP_SUBSCRIBE_message_subscribe_send =
  'https://api.weixin.qq.com/cgi-bin/message/subscribe/send';
export interface MpSubscribeMessageDto {
  errcode: number;
  merrmsg: string;
  msgid: number;
}
