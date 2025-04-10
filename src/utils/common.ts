import qs from 'qs'

interface PageInstance {
  route?: string
  options?: Record<string, any>
  [key: string]: any
}

interface ModalOptions {
  showCancel?: boolean
  title?: string
  [key: string]: any
}

interface UniModalResponse {
  confirm: boolean
  cancel: boolean
  [key: string]: any
}

export const getCurrRoute = (): PageInstance => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current
}

export const showModal = (
  content: string,
  { showCancel, title, ...options }: ModalOptions = {},
): Promise<UniModalResponse> => {
  return new Promise((resolve, reject) =>
    uni.showModal({
      showCancel: showCancel === true,
      title: title || '提示',
      ...options,
      content,
      success(e: UniModalResponse) {
        if (e.confirm) {
          return resolve(e)
        }
        reject(e)
      },
      fail: reject,
    }),
  )
}

export function mergingStep<T extends (...args: any[]) => any>(
  wrapped: T,
): (...args: Parameters<T>) => ReturnType<T> {
  let runningInstance: ReturnType<T> | null = null

  return function (...args: Parameters<T>): ReturnType<T> {
    if (runningInstance) {
      return runningInstance
    }

    const result = wrapped.apply(this, args)

    if (result && typeof result.then === 'function') {
      runningInstance = result
      runningInstance.finally(() => {
        runningInstance = null
      })
    }

    return result
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 50,
  immediate?: boolean,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    if (immediate && !timer) {
      fn.apply(this, args)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let previous = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    const now = +new Date()
    if (now - previous < delay) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        previous = now
        fn.apply(this, args)
      }, delay)
    } else {
      previous = now
      fn.apply(this, args)
    }
  }
}

export const displayPhone = (value: string | undefined): string | undefined => {
  if (!value) return
  return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export const joinStr = (...args: Array<string | undefined | null>): string => {
  return args.reduce((acc, cur) => {
    return acc + (cur || '')
  }, '')
}

export const onLoadOptions2Obj = (options: Record<string, any>) => {
  let querys = options
  if (options.q) {
    try {
      const searchStr = decodeURIComponent(options.q).split('?')[1]
      querys = qs.parse(searchStr)
    } catch (e) {
      console.warn(e)
    }
  }
  return (key: string) => {
    if (querys[key]) {
      return querys[key]
    } else {
      return ''
    }
  }
}

export const stringToArray = (
  str: string | string[] | undefined | null,
  separators: string[] = [',', ';'],
): string[] => {
  if (Array.isArray(str)) {
    return str
  }
  for (let i = 0; i < separators.length; i++) {
    const separator = separators[i]
    if ((str || '').includes(separator)) {
      return str!.split(separator)
    }
  }
  return str ? [str] : []
}

export const objDelByValues = <T extends Record<string, any>>(values: any[], obj: T): T => {
  if (!Array.isArray(values)) throw new Error('values required array')
  Object.keys(obj).forEach((key) => {
    if (values.includes(obj[key])) delete obj[key]
  })
  return obj
}

export const isObjectString = (value: string): boolean => {
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

export const getPageOptionsToObj = (
  options: Record<string, any>,
  key: string,
): Record<string, any> => {
  let result: Record<string, any> = {}
  if (options.q) {
    const q = decodeURIComponent(options.q)
    result = qs.parse(q?.split('?')[1] ?? q)
  } else {
    result =
      options[key] && isObjectString(decodeURIComponent(options[key]))
        ? JSON.parse(decodeURIComponent(options[key]))
        : {}
  }
  return result
}
