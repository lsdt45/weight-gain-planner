<template>
  <!-- ... 现有代码 ... -->
  <n-button type="primary" size="large" @click="router.push('/user-info')">开始制定计划</n-button>
  <!-- ... 现有代码 ... -->
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// ... 现有代码 ...
</script>