import qs from 'qs'
import { debounce } from './common'

interface NavigateConfig {
  url: string
  query?: Record<string, any>
}

// ... 常量定义保持不变 ...
const TABBAR_URL_LIST = []
const NOT_AUTH_URL_LIST = []

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
  // ... 函数实现保持不变 ...
}

export const toLoginWithRedirect = (url?: string) => {
  // ... 函数实现保持不变 ...
}

export const redirectLoginDebounced = debounce(toLoginWithRedirect, 1250)
