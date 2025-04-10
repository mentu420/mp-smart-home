import qs from 'qs'

export const getCurrRoute = () => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current
}

// Promise 版modal
export const showModal = (content, { showCancel, title, ...options } = {}) => {
  return new Promise((resolve, reject) =>
    uni.showModal({
      showCancel: showCancel === true,
      title: title || '提示',
      ...options,
      content,
      success(e) {
        if (e.confirm) {
          return resolve(e)
        }
        reject(e)
      },
      fail: reject,
    }),
  )
}

// 合并Promise请求
export function mergingStep(wrapped) {
  let runningInstance = null
  return function (...args) {
    if (runningInstance) {
      // 若步骤正在进行，则监听并使用其执行结果，而不是重新发起该步骤
      return runningInstance
    }
    const res = wrapped.apply(this, args)

    if (!(res instanceof Promise)) {
      return res
    }
    runningInstance = res
    runningInstance
      .then(function () {
        runningInstance = null
      })
      .catch(function () {
        runningInstance = null
      })
    return runningInstance
  }
}

/**
 * 防抖 用于减少函数触发的频率，在一个delay时间内，如果触发delay时间归零，直到delay时间到才会触发函数
 * @param fn  要执行的函数
 * @param delay 延迟的时间
 */
export function debounce(fn, delay = 50, immediate) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    // immediate 为 true 表示第一次触发后执行
    // timer 为空表示首次触发
    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * throttle节流函数定义：就是无论频率多快，每过一段时间就执行一次。 https://juejin.cn/post/6844903863061839885
 * @param fn  要执行的函数
 * @param delay 延迟的时间
 */
export function throttle(fn, delay) {
  // previous 是上一次执行 fn 的时间
  // timer 是定时器
  let previous = 0
  let timer = null

  // 将 throttle 处理结果当作函数返回
  return function (...args) {
    // 获取当前时间，转换成时间戳，单位毫秒
    const now = +new Date()

    // ------ 新增部分 start ------
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔
    if (now - previous < delay) {
      // 如果小于，则为本次触发操作设立一个新的定时器
      // 定时器时间结束后执行函数 fn
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        previous = now
        fn.apply(this, args)
      }, delay)
      // ------ 新增部分 end ------
    } else {
      // 第一次执行
      // 或者时间间隔超出了设定的时间间隔，执行函数 fn
      previous = now
      fn.apply(this, args)
    }
  }
}

// 手机号码加密
export const diplayPhone = (value) => {
  if (!value) return
  return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 拼接字符串
export const joinStr = (...args) => {
  return args.reduce((acc, cur) => {
    return acc + (cur || '')
  }, '')
}

export const onLoadOptions2Obj = (options) => {
  let querys = options
  if (options.q) {
    try {
      const searchStr = decodeURIComponent(options.q).split('?')[1]
      querys = qs.parse(searchStr)
    } catch (e) {
      console.warn(e)
    }
  }
  return (key) => {
    if (querys[key]) {
      return querys[key]
    } else {
      return ''
    }
  }
}

export const stringToArray = (str, separators = [',', ';']) => {
  if (Array.isArray(str)) {
    return str
  }
  for (let i = 0; i < separators.length; i++) {
    const separator = separators[i]
    if ((str || '').includes(separator)) {
      return str.split(separator)
    }
  }
  return str ? [str] : []
}

// 根据数组值删除对象中的值
export const objDelByValues = (values, obj) => {
  if (!Array.isArray(values)) throw new Error('values required array')
  Object.keys(obj).forEach((key) => {
    if (values.includes(obj[key])) delete obj[key]
  })
  return obj
}

// 判断一个字符串是否为JSON字符串
export const isObjectString = (value) => {
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

/**
 * @options string 路由参数
 * @key 路由跳转进入传的参数key
 * **/
export const getPageOptionsToObj = (options, key) => {
  let result = {}
  if (options.q) {
    const q = decodeURIComponent(options.q) // 获取到二维码原始链接内容
    result = qs.parse(q?.split('?')[1] ?? q)
  } else {
    result =
      options[key] && isObjectString(decodeURIComponent(options[key]))
        ? JSON.parse(decodeURIComponent(options[key]))
        : {}
  }
  return result
}
