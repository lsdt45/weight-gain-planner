<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInputNumber, NSlider, NButton, NCard, NSpace, NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter, NGrid, NGridItem, NH1, NText } from 'naive-ui'
import { useUserStore } from '../stores/user'
import StepsNav from '../components/StepsNav.vue'
import type { FormInst, FormValidationError, FormRules } from 'naive-ui'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)

// 添加明确的接口定义
interface FormModel {
  targetWeight: number | null;
  timeframe: number;
}

// 使用定义的接口
const formModel = reactive<FormModel>({
  targetWeight: userStore.targetWeight || null,
  timeframe: userStore.timeframe || 8
})

// 为规则添加类型
const rules: FormRules = {
  targetWeight: [
    { required: true, message: '请输入目标体重', trigger: 'blur' },
    { type: 'number', min: userStore.weight ? userStore.weight + 1 : 45, message: '目标体重必须大于当前体重', trigger: ['blur', 'change'] },
    { type: 'number', max: 150, message: '目标体重不能超过150kg', trigger: ['blur', 'change'] }
  ]
}

const handleNext = (e: Event) => {
  e.preventDefault()
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      userStore.updateGoalSettings({
        targetWeight: formModel.targetWeight,
        timeframe: formModel.timeframe
      })
      router.push('/plan-generation')
    }
  })
}

const goBack = () => {
  router.push('/user-info')
}

// 计算预计达到目标体重所需时间（周）
const estimatedWeeks = ref(0)
const calculateEstimatedWeeks = () => {
  if (formModel.targetWeight && userStore.weight) {
    const weightToGain = formModel.targetWeight - userStore.weight
    const weeklyGain = userStore.calculateWeeklyGainGoal()
    estimatedWeeks.value = Math.ceil(weightToGain / weeklyGain)
    // 如果用户手动设置了时间，则使用用户设置的时间
    if (formModel.timeframe !== estimatedWeeks.value) {
      formModel.timeframe = estimatedWeeks.value
    }
  }
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
          <StepsNav :current="1" />
          
          <n-h1>设定增重目标</n-h1>
          <n-text depth="3">请设置您的目标体重和期望达成的时间</n-text>
          
          <n-form
            ref="formRef"
            :model="formModel"
            :rules="rules"
            label-placement="left"
            label-width="100px"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="目标体重 (kg)" path="targetWeight" required>
              <n-input-number
                v-model="formModel.targetWeight"
                :min="userStore.weight ? userStore.weight + 1 : 45"
                :max="150"
                placeholder="请输入目标体重"
                style="width: 100%"
                @update:value="calculateEstimatedWeeks"
              />
            </n-form-item>
            
            <n-form-item label="期望时间 (周)" path="timeframe">
              <n-space vertical>
                <n-slider
                  v-model="formModel.timeframe"
                  :min="4"
                  :max="24"
                  :step="1"
                  :marks="{
                    4: '4周',
                    8: '8周',
                    12: '12周',
                    16: '16周',
                    20: '20周',
                    24: '24周'
                  }"
                />
                <n-space justify="space-between">
                  <n-text>{{ formModel.timeframe }}周</n-text>
                  <n-text v-if="userStore.weight && formModel.targetWeight">
                    预计每周增重: {{ ((formModel.targetWeight - userStore.weight) / formModel.timeframe).toFixed(2) }}kg
                  </n-text>
                </n-space>
              </n-space>
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