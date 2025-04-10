import { defineStore } from 'pinia'
import { ref } from 'vue'

const storeName = 'materialStore'

export default defineStore(storeName, () => {
  const materialImages = ref({}) // 图片对象 key：网络url value:本地资源路径

  const reset = () => {
    materialImages.value = {}
  }

  return { materialImages, reset }
})
