/* eslint-disable no-param-reassign */
import qs from 'qs'
import { useUserStore } from '@/store'
import { getEnvBaseUrl } from '@/utils'
import { getStorage } from '@/utils/storage'
import CryptoJS from 'crypto-js'

/**
 * 加密字符串
 * @param str 要加密的字符串
 * @param key 秘钥 必须大于八位
 * @returns 加密后的字符串或undefined
 */
const desEncrypt = (str: string, key: string): string | undefined => {
  try {
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const encrypted = CryptoJS.DES.encrypt(str, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  } catch (err) {
    console.error('DES加密失败:', err)
    return undefined
  }
}

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = getEnvBaseUrl()

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    // 将变量名改为更具描述性的名称，避免拼写检查误判
    const timestamp = new Date().valueOf().toString()
    const queryStr = qs.stringify({
      ...(options.query || {}),
      appid: import.meta.env.VITE_APP_APP_ID,
      timespan: timestamp,
      sign: desEncrypt(
        import.meta.env.VITE_APP_APP_ID + timestamp + import.meta.env.VITE_APP_REQUEST_SIGN,
        import.meta.env.VITE_APP_REQUEST_KEY,
      ),
    })
    if (options.url.includes('?')) {
      options.url += `&${queryStr}`
    } else {
      options.url += `?${queryStr}`
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__)) {
        // 啥都不需要做
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 10000 // 10s
    // 3. 添加 token 请求头标识
    const token = getStorage(import.meta.env.VITE_APP_STORAGE_TOKEN)
    if (token) {
      options.header.Authorization = token?.acessToken
    }
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
