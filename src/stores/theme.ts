import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import { useOsTheme } from 'naive-ui'
import { useStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const osThemeRef = useOsTheme()
  const storedTheme = useStorage('theme-preference', 'auto')
  
  const theme = ref(storedTheme.value)
  
  const isDark = computed(() => {
    if (theme.value === 'auto') {
      return osThemeRef.value === 'dark'
    }
    return theme.value === 'dark'
  })
  
  const naiveTheme = computed(() => {
    return isDark.value ? darkTheme : null
  })
  
  function toggleTheme() {
    if (theme.value === 'auto') {
      theme.value = 'dark'
    } else if (theme.value === 'dark') {
      theme.value = 'light'
    } else {
      theme.value = 'auto'
    }
    storedTheme.value = theme.value
  }
  
  return { theme, isDark, naiveTheme, toggleTheme }
})