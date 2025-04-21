/*
 * @Author: 菲鸽
 * @Date: 2024-03-28 19:13:55
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2025-04-14 14:52:20
 */
export const platform = __UNI_PLATFORM__
export const isH5 = __UNI_PLATFORM__ === 'h5'
export const isApp = __UNI_PLATFORM__ === 'app'
export const isMp = __UNI_PLATFORM__.startsWith('mp-')
export const isMpWeixin = __UNI_PLATFORM__.startsWith('mp-weixin')
export const isMpAplipay = __UNI_PLATFORM__.startsWith('mp-alipay')
export const isMpToutiao = __UNI_PLATFORM__.startsWith('mp-toutiao')

const PLATFORM = {
  platform,
  isH5,
  isApp,
  isMp,
  isMpWeixin,
  isMpAplipay,
  isMpToutiao,
}
export default PLATFORM
