<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NCard, NSpace, NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter, NGrid, NGridItem, NH1, NText, NSpin, NStatistic, NDivider, NProgress } from 'naive-ui'
import { useUserStore } from '../stores/user'
import StepsNav from '../components/StepsNav.vue'

const router = useRouter()
const userStore = useUserStore()

/**
 * 营养数据接口
 * @interface NutritionData
 * @description 存储用户的营养计算结果，包括基础代谢率、每日能量消耗和三大营养素分配
 */
interface NutritionData {
  /** 基础代谢率(BMR)，单位：kcal/天 */
  bmr: number;
  /** 每日总能量消耗(TDEE)，单位：kcal/天 */
  tdee: number;
  /** 增重所需每日摄入热量，单位：kcal/天 */
  dailyCalories: number;
  /** 每周科学增重目标，单位：kg/周 */
  weeklyGainGoal: number;
  /** 每日蛋白质摄入量，单位：g/天 */
  protein: number;
  /** 每日碳水化合物摄入量，单位：g/天 */
  carbs: number;
  /** 每日脂肪摄入量，单位：g/天 */
  fat: number;
}

const loading = ref(true)
const calculationComplete = ref(false)
const nutritionData = ref<NutritionData | null>(null)

// 计算营养数据
const calculateData = () => {
  loading.value = true
  
  // 模拟计算过程
  setTimeout(() => {
    nutritionData.value = userStore.calculateNutrition()
    loading.value = false
    calculationComplete.value = true
  }, 1500)
}

// 页面加载时开始计算
onMounted(() => {
  calculateData()
})

const goBack = () => {
  router.push('/goal-setting')
}

const viewResults = () => {
  router.push('/results')
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
      <n-card class="plan-card">
        <n-space vertical size="large">
          <StepsNav :current="3" />
          
          <n-h1>生成增重计划</n-h1>
          
          <div v-if="loading" class="loading-container">
            <n-spin size="large" />
            <n-text style="margin-top: 16px">正在计算您的个性化增重计划...</n-text>
          </div>
          
          <div v-else-if="calculationComplete" class="results-container">
            <n-text>基于您的个人数据，我们计算出以下营养需求：</n-text>
            
            <n-grid :cols="24" :x-gap="12" class="stats-grid">
              <n-grid-item :span="24" :md="8">
                <n-card class="stat-card">
                  <n-statistic label="基础代谢率 (BMR)" :value="nutritionData?.bmr">
                    <template #suffix>
                      <span>kcal/天</span>
                    </template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              
              <n-grid-item :span="24" :md="8">
                <n-card class="stat-card">
                  <n-statistic label="每日总消耗 (TDEE)" :value="nutritionData?.tdee">
                    <template #suffix>
                      <span>kcal/天</span>
                    </template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              
              <n-grid-item :span="24" :md="8">
                <n-card class="stat-card highlight">
                  <n-statistic label="增重所需热量" :value="nutritionData?.dailyCalories">
                    <template #suffix>
                      <span>kcal/天</span>
                    </template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
            </n-grid>
            
            <n-divider>每周增重目标</n-divider>
            
            <n-card class="weekly-goal-card">
              <n-space vertical>
                <n-text>科学增重速度：每周 {{ nutritionData?.weeklyGainGoal }} kg</n-text>
                <n-progress
                  type="line"
                  :percentage="100"
                  :indicator-placement="'inside'"
                  :color="'#18a058'"
                  :height="24"
                >
                  <span style="color: white">{{ nutritionData?.weeklyGainGoal }} kg/周</span>
                </n-progress>
              </n-space>
            </n-card>
            
            <n-divider>三大营养素分配</n-divider>
            
            <n-grid :cols="24" :x-gap="12" class="macros-grid">
              <n-grid-item :span="24" :md="8">
                <n-card class="macro-card protein">
                  <n-statistic label="蛋白质" :value="nutritionData?.protein">
                    <template #suffix>
                      <span>g/天</span>
                    </template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              
              <n-grid-item :span="24" :md="8">
                <n-card class="macro-card carbs">
                  <n-statistic label="碳水化合物" :value="nutritionData?.carbs">
                    <template #suffix>
                      <span>g/天</span>
                    </template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              
              <n-grid-item :span="24" :md="8">
                <n-card class="macro-card fat">
                  <n-statistic label="脂肪" :value="nutritionData?.fat">
                    <template #suffix>
                      <span>g/天</span>
                    </template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
            </n-grid>
            
            <n-grid :cols="24" :x-gap="12">
              <n-grid-item :span="12">
                <n-button block @click="goBack">返回</n-button>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-button type="primary" block @click="viewResults">查看详细计划</n-button>
              </n-grid-item>
            </n-grid>
          </div>
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

.plan-card {
  max-width: 800px;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.results-container {
  margin-top: 16px;
}

.stats-grid, .macros-grid {
  margin: 24px 0;
}

.stat-card {
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  &.highlight {
    border: 2px solid #18a058;
  }
}

.weekly-goal-card {
  margin: 16px 0;
}

.macro-card {
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  &.protein {
    border-top: 4px solid #d03050;
  }
  
  &.carbs {
    border-top: 4px solid #2080f0;
  }
  
  &.fat {
    border-top: 4px solid #f0a020;
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
  
  .plan-card {
    max-width: 100%;
  }
}
</style>