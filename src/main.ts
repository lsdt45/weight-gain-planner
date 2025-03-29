import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 导入Naive UI
import naive from 'naive-ui'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive) // 确保这行代码存在

app.mount('#app')
