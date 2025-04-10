import qs from 'qs'
import { debounce, showModal } from './common'
import { useUserStore } from '@/store/'

interface NavigateConfig {
  url: string
  query?: Record<string, any>
}

// 未登录用户允许访问的页面白名单列表,允许正则或者字符串
export const NOT_AUTH_URL_LIST = ['^/pages/common/.*']
// Tabbar页面列表
export const TABBAR_URL_LIST = [
  '/pages/tabbar/homePage',
  '/pages/tabbar/cartPage',
  '/pages/tabbar/categoryPage',
  '/pages/tabbar/myPage',
]
// 登录授权页
export const LOGIN_PAGE = '/pages/common/login/loginPage'
// WebView 页面
export const WEB_PAGE = '/pages/common/web/webPage'

export const equalPath = (path1: string, path2: string): boolean => {
  path1 = path1.split('?')[0]
  path2 = path2.split('?')[0]
  return path1.replace(/^\//, '') === path2.replace(/^\//, '')
}

export const checkIsWebURL = (url: string): boolean => url.indexOf('http') === 0

export const checkWithAuthUrl = (url: string): boolean => {
  const [path] = url.split('?')
  return !NOT_AUTH_URL_LIST.some((url) => new RegExp(url).test(path))
}

export const checkTabbarUrl = (url: string): boolean => {
  return TABBAR_URL_LIST.some((tabbarUrl) => equalPath(tabbarUrl, url))
}

export const navigateTo = async (
  config: NavigateConfig,
  type: 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' = 'navigateTo',
  withAuth: boolean = true,
) => {
  const isWebUrl = checkIsWebURL(config.url)
  const userStore = useUserStore()
  if (isWebUrl) {
    return uni.navigateTo({
      url: `${WEB_PAGE}?url=${config.url}`,
    })
  }
  const [pathUrl, searchStr] = config.url.split('?')
  const query = Object.assign({}, qs.parse(searchStr), config.query || {})
  config.url = `${pathUrl}?${qs.stringify(query)}`
  const userInfo = await userStore.useUserInfoSync()
  if (!userInfo && checkWithAuthUrl(pathUrl) && withAuth) {
    // 授权检测，不通过跳转授权页
    await showModal('进入该页面需要授权用户信息', {
      showCancel: true,
    })
    return toLoginWithRedirect(config.url)
  }
  // if (checkTabbarUrl(pathUrl)) {
  //   return uni.switchTab(config)
  // }
  return uni[type](config)
}

export const toLoginWithRedirect = (url?: string) => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (equalPath(currentPage.route, LOGIN_PAGE)) {
    return
  }
  const redirectUrl = url || currentPage?.$page.fullPath
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(redirectUrl)}`,
  })
}

export const redirectLoginDebounced = debounce(toLoginWithRedirect, 1250)
