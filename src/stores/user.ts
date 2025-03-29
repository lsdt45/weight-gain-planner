import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// 定义用户数据接口
interface UserData {
  // 基本信息
  gender: 'male' | 'female';
  age: number | null;
  height: number | null;
  weight: number | null;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  
  // 目标设置
  targetWeight: number | null;
  timeframe: number;
  
  // 计算结果
  bmr: number | null;
  tdee: number | null;
  dailyCalories: number | null;
  weeklyGainGoal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

// 定义活动系数类型
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const useUserStore = defineStore('user', () => {
  // 使用localStorage持久化存储用户数据
  const userData = useStorage<UserData>('user-data', {
    // 基本信息
    gender: 'male',
    age: null,
    height: null,
    weight: null,
    activityLevel: 'moderate',
    
    // 目标设置
    targetWeight: null,
    timeframe: 8, // 默认8周
    
    // 计算结果
    bmr: null,
    tdee: null,
    dailyCalories: null,
    weeklyGainGoal: null,
    protein: null,
    carbs: null,
    fat: null
  })
  
  // 活动系数映射
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }
  
  // 更新用户基本信息
  function updateUserInfo(info: Partial<UserData>): void {
    userData.value = { ...userData.value, ...info }
  }
  
  // 更新目标设置
  function updateGoalSettings(settings: Partial<UserData>): void {
    userData.value = { ...userData.value, ...settings }
  }
  
  // 计算基础代谢率 (BMR) - Harris-Benedict公式
  function calculateBMR(): number {
    const { gender, age, height, weight } = userData.value
    
    if (!age || !height || !weight) return 0
    
    let bmr = 0
    if (gender === 'male') {
      // 男性 BMR = 88.362 + (13.397 × 体重kg) + (4.799 × 身高cm) - (5.677 × 年龄)
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      // 女性 BMR = 447.593 + (9.247 × 体重kg) + (3.098 × 身高cm) - (4.330 × 年龄)
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
    
    return Math.round(bmr)
  }
  
  // 计算每日总能量消耗 (TDEE)
  function calculateTDEE(): number {
    const bmr = calculateBMR()
    const factor = activityFactors[userData.value.activityLevel as ActivityLevel] || 1.55
    return Math.round(bmr * factor)
  }
  
  // 计算增重所需热量
  function calculateCaloriesForGain(): number {
    const tdee = calculateTDEE()
    // 增重热量盈余 (增加300-500卡路里)
    return Math.round(tdee + 400) // 使用中间值400卡
  }
  
  // 计算每周增重目标 (科学范围0.3-0.5kg/周)
  function calculateWeeklyGainGoal(): number {
    // 默认每周增重0.4kg
    return 0.4
  }
  
  // 计算蛋白质需求 (g)
  function calculateProtein(): number {
    const { weight } = userData.value
    if (!weight) return 0
    // 增重期间蛋白质需求: 1.6-2.2g/kg体重，取中间值1.9g/kg
    return Math.round(weight * 1.9)
  }
  
  // 计算脂肪需求 (g)
  function calculateFat(): number {
    const calories = calculateCaloriesForGain()
    // 脂肪占总热量的25% (1g脂肪 = 9卡路里)
    return Math.round((calories * 0.25) / 9)
  }
  
  // 计算碳水需求 (g)
  function calculateCarbs(): number {
    const calories = calculateCaloriesForGain()
    const proteinCalories = calculateProtein() * 4 // 1g蛋白质 = 4卡路里
    const fatCalories = calculateFat() * 9 // 1g脂肪 = 9卡路里
    // 剩余热量由碳水提供 (1g碳水 = 4卡路里)
    return Math.round((calories - proteinCalories - fatCalories) / 4)
  }
  
  // 计算所有营养数据
  function calculateNutrition() {
    const bmr = calculateBMR()
    const tdee = calculateTDEE()
    const dailyCalories = calculateCaloriesForGain()
    const weeklyGainGoal = calculateWeeklyGainGoal()
    const protein = calculateProtein()
    const fat = calculateFat()
    const carbs = calculateCarbs()
    
    // 更新计算结果
    userData.value = {
      ...userData.value,
      bmr,
      tdee,
      dailyCalories,
      weeklyGainGoal,
      protein,
      carbs,
      fat
    }
    
    return {
      bmr,
      tdee,
      dailyCalories,
      weeklyGainGoal,
      protein,
      carbs,
      fat
    }
  }
  
  // 计算预计达到目标体重所需时间（周）
  function calculateTimeToGoal(): number {
    const { weight, targetWeight } = userData.value
    if (!weight || !targetWeight || targetWeight <= weight) return 0
    
    const weightToGain = targetWeight - weight
    const weeklyGain = calculateWeeklyGainGoal()
    
    return Math.ceil(weightToGain / weeklyGain)
  }
  
  // 生成体重增长预测数据
  interface WeightProjection {
    week: number;
    weight: number;
  }
  
  function generateWeightProjection(): WeightProjection[] {
    const { weight, targetWeight, timeframe } = userData.value
    if (!weight || !targetWeight) return []
    
    const weeklyGain = calculateWeeklyGainGoal()
    const weeks = timeframe || calculateTimeToGoal()
    
    const projection: WeightProjection[] = []
    let currentWeight = weight
    
    for (let week = 0; week <= weeks; week++) {
      projection.push({
        week,
        weight: parseFloat((currentWeight).toFixed(1))
      })
      currentWeight += weeklyGain
    }
    
    return projection
  }
  
  // 导出所有需要的属性和方法
  return {
    ...userData.value,
    updateUserInfo,
    updateGoalSettings,
    calculateBMR,
    calculateTDEE,
    calculateCaloriesForGain,
    calculateWeeklyGainGoal,
    calculateProtein,
    calculateFat,
    calculateCarbs,
    calculateNutrition,
    calculateTimeToGoal,
    generateWeightProjection
  }
})