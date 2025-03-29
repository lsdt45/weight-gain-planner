<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import StepsNav from '../components/StepsNav.vue'

// 添加调试信息
onMounted(() => {
  console.log('UserInfoView mounted')
  console.log('Initial gender value:', formModel.gender)
})

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)

// 确保初始值是字符串类型
const formModel = reactive({
  gender: userStore.gender === 'male' || userStore.gender === 'female' ? userStore.gender : 'male',
  age: userStore.age || null,
  height: userStore.height || null,
  weight: userStore.weight || null,
  activityLevel: userStore.activityLevel || 'moderate'
})

// 添加一个调试函数来监控性别变化
const handleGenderChange = (value: string) => {
  console.log('Gender changed to:', value)
  formModel.gender = value as 'male' | 'female'
}

const activityOptions = [
  { label: '久坐不动 (几乎不运动)', value: 'sedentary', factor: 1.2 },
  { label: '轻度活动 (每周轻度运动1-3天)', value: 'light', factor: 1.375 },
  { label: '中度活动 (每周中度运动3-5天)', value: 'moderate', factor: 1.55 },
  { label: '积极活动 (每周剧烈运动6-7天)', value: 'active', factor: 1.725 },
  { label: '非常活跃 (每天剧烈运动或体力劳动)', value: 'very_active', factor: 1.9 }
]

const rules = {
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 16, max: 80, message: '年龄必须在16-80岁之间', trigger: ['blur', 'change'] }
  ],
  height: [
    { required: true, message: '请输入身高', trigger: 'blur' },
    { type: 'number', min: 140, max: 220, message: '身高必须在140-220cm之间', trigger: ['blur', 'change'] }
  ],
  weight: [
    { required: true, message: '请输入体重', trigger: 'blur' },
    { type: 'number', min: 40, max: 150, message: '体重必须在40-150kg之间', trigger: ['blur', 'change'] }
  ]
}

const handleNext = (e: Event) => {
  e.preventDefault();
  (formRef.value as any)?.validate((errors: any) => {
    if (!errors) {
      userStore.updateUserInfo({
        gender: formModel.gender,
        age: formModel.age,
        height: formModel.height,
        weight: formModel.weight,
        activityLevel: formModel.activityLevel
      })
      router.push('/goal-setting')
    }
  })
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <n-layout class="layout">
    <n-layout-header class="header">
      <div class="header-content">
        <h1 class="logo">增重计划助手</h1>
      </div>
    </n-layout-header>
    
    <n-layout-content class="content">
      <n-card class="form-card">
        <n-space vertical size="large">
          <StepsNav :current="0" />
          
          <n-h1>基本信息</n-h1>
          <n-text depth="3">请填写您的基本身体数据，以便我们计算您的基础代谢率和能量需求</n-text>
          
          <n-form
            ref="formRef"
            :model="formModel"
            :rules="rules"
            label-placement="left"
            label-width="100px"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="性别" path="gender">
              <!-- 修改单选按钮组的绑定方式 -->
              <n-radio-group v-model:value="formModel.gender" @update:value="handleGenderChange">
                <n-space>
                  <n-radio value="male">男性</n-radio>
                  <n-radio value="female">女性</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            
            <n-form-item label="年龄" path="age" required>
              <n-input-number
                v-model="formModel.age"
                :min="16"
                :max="80"
                placeholder="请输入年龄"
                style="width: 100%"
              />
            </n-form-item>
            
            <n-form-item label="身高 (cm)" path="height" required>
              <n-input-number
                v-model="formModel.height"
                :min="140"
                :max="220"
                placeholder="请输入身高"
                style="width: 100%"
              />
            </n-form-item>
            
            <n-form-item label="体重 (kg)" path="weight" required>
              <n-input-number
                v-model="formModel.weight"
                :min="40"
                :max="150"
                placeholder="请输入体重"
                style="width: 100%"
              />
            </n-form-item>
            
            <n-form-item label="活动水平" path="activityLevel">
              <n-select
                v-model="formModel.activityLevel"
                :options="activityOptions"
                placeholder="请选择您的日常活动水平"
              />
            </n-form-item>
            
            <n-grid :cols="24" :x-gap="12">
              <n-grid-item :span="12">
                <n-button block @click="goBack">返回</n-button>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-button type="primary" block @click="handleNext">下一步</n-button>
              </n-grid-item>
            </n-grid>
          </n-form>
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

.form-card {
  max-width: 800px;
  width: 100%;
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
  
  .form-card {
    max-width: 100%;
  }
}
</style>