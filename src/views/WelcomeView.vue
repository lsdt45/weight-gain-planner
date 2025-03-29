<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton, NCard, NSpace, NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter, NText, NH1, NH2, NIcon } from 'naive-ui'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const themeStore = useThemeStore()

const startPlanner = () => {
  router.push('/user-info')
}
</script>

<template>
  <n-layout class="layout">
    <n-layout-header class="header">
      <div class="header-content">
        <h1 class="logo">增重计划助手</h1>
        <n-button quaternary circle @click="themeStore.toggleTheme">
          <n-icon>
            <svg v-if="themeStore.isDark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m0 2c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58m12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06m1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06M7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z" />
            </svg>
          </n-icon>
        </n-button>
      </div>
    </n-layout-header>
    
    <n-layout-content class="content">
      <n-card class="welcome-card">
        <n-space vertical align="center">
          <n-h1>科学增重计划</n-h1>
          <n-h2>定制您的专属增重方案</n-h2>
          <div class="features">
            <n-text>✓ 基于科学公式计算</n-text>
            <n-text>✓ 个性化营养建议</n-text>
            <n-text>✓ 可视化增重曲线</n-text>
            <n-text>✓ 专业三大营养素分配</n-text>
          </div>
          <n-button type="primary" size="large" @click="startPlanner">开始制定计划</n-button>
        </n-space>
      </n-card>
    </n-layout-content>
    
    <n-layout-footer class="footer">
      <n-text>© {{ new Date().getFullYear() }} 增重计划助手 | 专业健康增重方案</n-text>
    </n-layout-footer>
  </n-layout>
</template>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
  
  &-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .logo {
    margin: 0;
    font-size: 1.5rem;
  }
}

.content {
  flex: 1;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
  
  .features {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 24px 0;
  }
}

.footer {
  padding: 16px 24px;
  text-align: center;
}

@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }
  
  .content {
    padding: 16px;
  }
  
  .welcome-card {
    max-width: 100%;
  }
}
</style>