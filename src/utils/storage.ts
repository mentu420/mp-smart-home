interface ImportMetaEnv {
  VITE_APP_TITLE: string
}

interface ImportMeta {
  env: ImportMetaEnv
}

const paltName = `${import.meta.env.VITE_APP_TITLE}_`

const platKey = (key: string): string => paltName + key
const isJSON = (value: string): boolean => /^{(.?)+}$/.test(value) || /^\[(.?)+\]$/.test(value)

export const getStorage = <T = any>(key: string, isPalt: boolean = true): T | string | null => {
  const value = uni.getStorageSync(isPalt ? platKey(key) : key)
  if (isJSON(value)) {
    try {
      return JSON.parse(value) as T
    } catch (err) {
      return value
    }
  }
  return value
}

export const removeStorage = (key: string, isPalt: boolean = true): void => {
  uni.removeStorageSync(isPalt ? platKey(key) : key)
}

export const setStorage = (key: string, value: any, isPalt: boolean = true): void => {
  if (!key) {
    return
  }
  uni.setStorageSync(
    isPalt ? platKey(key) : key,
    typeof value === 'object' ? JSON.stringify(value) : value,
  )
}
