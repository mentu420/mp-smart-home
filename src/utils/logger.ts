interface UniRealtimeLogManager {
  debug?: (...args: any[]) => void
  info?: (...args: any[]) => void
  warn?: (...args: any[]) => void
  error?: (...args: any[]) => void
  setFilterMsg?: (msg: string) => void
  addFilterMsg?: (msg: string) => void
}

const log: UniRealtimeLogManager | undefined = uni.getRealtimeLogManager?.()

function logWrapper(logFn: 'debug' | 'info' | 'warn' | 'error') {
  return function (...args: any[]) {
    console[logFn](...args)
    if (log && log[logFn]) {
      log[logFn]!(...args)
    }
  }
}

export const logger = {
  debug: logWrapper('debug'),
  info: logWrapper('info'),
  warn: logWrapper('warn'),
  error: logWrapper('error'),
  setFilterMsg: (message: string) => {
    if (log?.setFilterMsg && typeof message === 'string') {
      console.log(message)
      log.setFilterMsg(message)
    }
  },
  addFilterMsg: (message: string) => {
    if (log?.addFilterMsg && typeof message === 'string') {
      console.log(message)
      log.addFilterMsg(message)
    }
  },
}

export default logger
