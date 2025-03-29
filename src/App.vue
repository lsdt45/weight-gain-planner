<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NGlobalStyle } from 'naive-ui'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <n-config-provider :theme="themeStore.naiveTheme">
    <n-message-provider>
      <n-global-style />
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
