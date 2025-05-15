// utils/wx-auth.js
export function getWeixinAuthUrl(appid, redirectUri) {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
}
