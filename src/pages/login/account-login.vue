<script setup>
import { ref } from 'vue'
import { navigateTo } from '@/utils/navigate'
import useLogin from '@/hooks/useLogin'
import { getStorage, setStorage } from '@/utils/storage'
import AgreementConceal from './components/AgreementConceal.vue'

defineOptions({ name: 'AccountLogin' })

const form = ref({ agree: false })
const showPopover = ref(false) // 是否展示记住的账号
const showPassword = ref(false)
const accountList = ref([])
const loading = ref(false)

const onSubmit = async (values) => {
  try {
    loading.value = true
    await useLogin({
      shoujihaoma: form.value.username,
      mima: form.value.password,
      dengluleixing: 1,
    })
  } catch (error) {
    console.warn(error)
    uni.showModal({
      title: '错误',
      content: error?.data?.des ?? error.message ?? JSON.stringify(error?.data),
      showCancel: false,
    })
  } finally {
    loading.value = false
  }
}

const selectAccountItem = (item) => {
  showPopover.value = false
  form.value = item
}

const delectAccountItem = (index) => {
  accountList.value = accountList.value.filter((item, i) => index !== i)
}

const init = () => {
  accountList.value = getStorage('account-list') || []
}

init()

const goForget = () => {
  router.push({ path: '/forget-password' })
}

const goOtherLogin = (type) => {
  router.push({ path: '/phone-login', query: { type } })
}
</script>

<template>
  <view class="p-4 pt-safe-offset-4 h-screen bg-white">
    <text class="mb-10 ml-2 mt-10 text-2xl font-bold">密码登录</text>
    <wd-form class="m-2" :model="form">
      <wd-cell-group>
        <wd-input
          v-model="form.username"
          center
          name="username"
          placeholder="用户名"
          class="!py-6"
          :maxlength="30"
          :rules="[{ required: true, message: '请填写用户名' }]"
          @focus="showPopover = true"
          @blur="showPopover = false"
        />
        <wd-input
          v-model="form.password"
          center
          name="password"
          placeholder="密码"
          class="!py-6"
          :maxlength="18"
          :type="showPassword ? 'text' : 'password'"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #suffix>
            <view class="flex items-center">
              <wd-icon
                :name="showPassword ? 'eye-o' : 'closed-eye'"
                @click="showPassword = !showPassword"
              />
              <text class="ml-4" @click="goForget">忘记密码</text>
            </view>
          </template>
        </wd-input>
        <AgreementConceal v-model="form.agree" class="mt-4" />
      </wd-cell-group>
      <view class="my-4">
        <wd-button round block type="success" :loading="loading" @click="onSubmit">登录</wd-button>
      </view>
      <view class="text-center flex justify-between items-center p-4">
        <text @click="goOtherLogin(0)">立即注册</text>
        <text @click="goOtherLogin(1)">验证码登录</text>
      </view>
    </wd-form>
  </view>
</template>
