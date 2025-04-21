<script setup>
import { useAttrs, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const attrs = useAttrs()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const navigateTo = (args) => router.push(args)
</script>

<template>
  <wd-checkbox
    v-bind="attrs"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    prop="read"
    custom-label-class="label-class"
  >
    <text class="text-gray-500 text-xs">
      同意并遵守
      <text class="text-origin" @click.stop.self="navigateTo({ path: '/me-agreement' })">
        《服务协议》
      </text>
      和
      <text class="text-origin" @click.stop.self="navigateTo({ path: '/me-conceal' })">
        《隐私政策》
      </text>
    </text>
  </wd-checkbox>
</template>
