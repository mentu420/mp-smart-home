import { setUserConfig } from '@/apis/commonApi'
import userStore from '@/store/userStore'
import { platform } from '@/utils/platform'

const useLogin = async (loginData) => {
  const { useSetToken } = userStore()
  const systemInfo = uni.getSystemInfoSync()
  const { data } = await setUserConfig(
    {
      params: { op: '0' },
      data: {
        shoujixinghao: platform,
        shoujimingcheng: platform,
        xitongleixing: systemInfo.osName === 'ios' ? 1 : 2,
        dengluleixing: 2,
        tuisongtoken: 'tuisongtoken',
        ...loginData,
      },
    },
    { withToken: false },
  )
  useSetToken(data)
}

export default useLogin
