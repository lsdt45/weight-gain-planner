import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue')
    },
    // 确保UserInfoView组件已正确导入和配置
    {
      path: '/user-info',
      name: 'userInfo',
      component: () => import('../views/UserInfoView.vue')
    },
    {
      path: '/goal-setting',
      name: 'goalSetting',
      component: () => import('../views/GoalSettingView.vue')
    },
    {
      path: '/plan-generation',
      name: 'planGeneration',
      component: () => import('../views/PlanGenerationView.vue')
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('../views/ResultsView.vue')
    }
  ]
})

export default router