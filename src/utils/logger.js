const log = uni.getRealtimeLogManager?.()

function logWrapper(logFn) {
  return function (...args) {
    console[logFn](...args)
    if (log) {
      log[logFn](...args)
    }
  }
}

export const logger = {
  debug: logWrapper('debug'),
  info: logWrapper('info'),
  warn: logWrapper('warn'),
  error: logWrapper('error'),
  setFilterMsg: (message) => {
    if (log?.setFilterMsg && typeof message === 'string') {
      console.log(message)
      log.setFilterMsg(message)
    }
  },
  addFilterMsg: (message) => {
    if (log?.addFilterMsg && typeof message === 'string') {
      console.log(message)
      log.addFilterMsg(message)
    }
  },
}

export default logger
