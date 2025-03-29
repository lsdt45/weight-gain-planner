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
  // 计算基础代谢率 (BMR) - Harris-Benedict公式
  function calculateBMR(): number {
    const { gender, age, height, weight } = userData.value
    
    if (!age || !height || !weight) return 0
    
    let bmr = 0
    if (gender === 'male') {
      // 使用更新版本的Harris-Benedict公式 (1990年修订版)
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
    const { weight, targetWeight, activityLevel } = userData.value
    
    // 默认热量盈余 (增加300-500卡路里)
    let caloriesSurplus = 400 // 默认使用中间值400卡
    
    // 如果设置了目标体重，根据目标体重和当前体重的差值动态调整热量盈余
    if (weight && targetWeight && targetWeight > weight) {
      const weightDiff = targetWeight - weight
      
      // 根据体重差值调整热量盈余
      // 体重差值越大，热量盈余越大，但保持在科学范围内(300-600卡)
      // 对于小幅增重(1-3kg)，使用较小的热量盈余(300-400卡)
      // 对于中等增重(3-8kg)，使用中等热量盈余(400-500卡)
      // 对于大幅增重(>8kg)，使用较大热量盈余(500-600卡)
      if (weightDiff <= 3) {
        caloriesSurplus = 300 + (weightDiff * 33.33) // 1kg差值增加33.33卡，最大增加到400卡
      } else if (weightDiff <= 8) {
        caloriesSurplus = 400 + ((weightDiff - 3) * 20) // 每增加1kg差值增加20卡，最大增加到500卡
      } else {
        caloriesSurplus = 500 + ((weightDiff - 8) * 10) // 每增加1kg差值增加10卡，但最大不超过600卡
      }
      
      // 设置上限为600卡
      caloriesSurplus = Math.min(600, caloriesSurplus)
      
      // 根据活动水平微调热量盈余
      // 活动水平越高，代谢率越高，可以适当增加热量盈余
      const activityFactor = activityFactors[activityLevel as ActivityLevel] || 1.55
      if (activityFactor >= 1.725) { // 高活动水平
        caloriesSurplus *= 1.1 // 增加10%
      } else if (activityFactor <= 1.375) { // 低活动水平
        caloriesSurplus *= 0.9 // 减少10%
      }
    }
    
    return Math.round(tdee + caloriesSurplus)
  }
  
  // 计算每周增重目标 (科学范围0.25-0.5kg/周)
  function calculateWeeklyGainGoal(): number {
    const { weight, targetWeight, timeframe } = userData.value
    
    // 如果没有设置目标体重或目标体重小于等于当前体重，返回默认值
    if (!weight || !targetWeight || targetWeight <= weight) return 0.4
    
    // 计算需要增加的总体重
    const weightToGain = targetWeight - weight
    
    // 根据用户设置的期望周期计算每周应增重多少
    let weeklyGain = weightToGain / timeframe
    
    // 确保每周增重在科学合理的范围内 (0.25-0.5kg/周)
    // 对于体重较轻的人，每周增重上限应该更低
    // 对于体重较重的人，可以接受稍高的每周增重
    let maxWeeklyGain = 0.5
    if (weight < 60) {
      maxWeeklyGain = 0.4 // 体重较轻者每周增重上限降低
    } else if (weight > 80) {
      maxWeeklyGain = 0.6 // 体重较重者可以接受稍高的每周增重
    }
    
    weeklyGain = Math.max(0.25, Math.min(maxWeeklyGain, weeklyGain))
    
    return parseFloat(weeklyGain.toFixed(2))
  }
  
  // 计算蛋白质需求 (g)
  function calculateProtein(): number {
    const { weight, targetWeight, timeframe, activityLevel } = userData.value
    if (!weight) return 0
    
    // 基础蛋白质需求: 1.6-2.2g/kg体重
    let proteinFactor = 1.9 // 默认中间值
    
    // 根据活动水平调整蛋白质需求
    // 活动水平越高，蛋白质需求越高
    const activityFactor = activityFactors[activityLevel as ActivityLevel] || 1.55
    if (activityFactor >= 1.725) { // 高活动水平
      proteinFactor += 0.1 // 增加蛋白质需求
    } else if (activityFactor <= 1.375) { // 低活动水平
      proteinFactor -= 0.1 // 减少蛋白质需求
    }
    
    // 如果设置目标体重，则使用当前体重计算
    if (!targetWeight || targetWeight <= weight) {
      return Math.round(weight * proteinFactor)
    }
    
    // 如果有目标体重，则根据当前体重和目标体重的平均值计算
    const averageWeight = (weight + targetWeight) / 2
    
    // 根据增重周期调整蛋白质需求
    if (timeframe <= 6) {
      proteinFactor = Math.min(2.2, proteinFactor + 0.2) // 短期增重，提高蛋白质摄入
    } else if (timeframe <= 12) {
      proteinFactor = Math.min(2.0, proteinFactor) // 中期增重，中等蛋白质摄入
    } else {
      proteinFactor = Math.min(1.8, proteinFactor - 0.1) // 长期增重，适度蛋白质摄入
    }
    
    return Math.round(averageWeight * proteinFactor)
  }
  
  // 计算脂肪需求 (g)
  function calculateFat(): number {
    const { weight, targetWeight, timeframe } = userData.value
    const calories = calculateCaloriesForGain()
    
    // 标准脂肪比例为25%
    let fatRatio = 0.25
    
    // 根据增重周期调整基础脂肪比例
    // 短期增重(≤6周)：提高脂肪比例至26-30%，短期内提供更多能量支持
    // 中期增重(7-12周)：保持中等脂肪比例24-26%
    // 长期增重(>12周)：降低脂肪比例至20-23%，长期增重需控制脂肪摄入
    if (timeframe <= 6) {
      fatRatio = 0.28 // 短期增重，提高脂肪比例
    } else if (timeframe <= 12) {
      fatRatio = 0.25 // 中期增重，中等脂肪比例
    } else {
      fatRatio = 0.22 // 长期增重，降低脂肪比例
    }
    
    // 如果设置了目标体重，根据目标体重和当前体重的差值微调脂肪比例
    if (targetWeight && weight && targetWeight > weight) {
      const weightDiff = targetWeight - weight
      // 根据体重差微调脂肪比例，但保持在合理范围内
      // 短期增重：26-30%
      // 中期增重：24-26%
      // 长期增重：20-23%
      if (timeframe <= 6) {
        fatRatio = Math.min(0.30, Math.max(0.26, fatRatio + (weightDiff * 0.004)))
      } else if (timeframe <= 12) {
        fatRatio = Math.min(0.26, Math.max(0.24, fatRatio + (weightDiff * 0.002)))
      } else {
        fatRatio = Math.min(0.23, Math.max(0.20, fatRatio + (weightDiff * 0.003)))
      }
    }
    
    // 脂肪占总热量的比例 (1g脂肪 = 9卡路里)
    return Math.round((calories * fatRatio) / 9)
  }
  
  // 计算碳水需求 (g)
  function calculateCarbs(): number {
    const { weight, targetWeight, timeframe } = userData.value
    const calories = calculateCaloriesForGain()
    const proteinCalories = calculateProtein() * 4 // 1g蛋白质 = 4卡路里
    const fatCalories = calculateFat() * 9 // 1g脂肪 = 9卡路里
    
    // 基础计算：剩余热量由碳水提供 (1g碳水 = 4卡路里)
    let carbsAmount = (calories - proteinCalories - fatCalories) / 4
    
    // 根据增重周期调整碳水化合物量
    let timeframeAdjustment = 1.0
    
    // 短期增重(≤6周)：轻微提高碳水比例，因为短期内脂肪已提供足够能量
    // 中期增重(7-12周)：适度提高碳水比例
    // 长期增重(>12周)：显著提高碳水比例，弥补长期增重中降低的脂肪摄入
    if (timeframe <= 6) {
      timeframeAdjustment = 1.03 // 短期增重，提高3%碳水摄入
    } else if (timeframe <= 12) {
      timeframeAdjustment = 1.08 // 中期增重，提高8%碳水摄入
    } else {
      timeframeAdjustment = 1.15 // 长期增重，提高15%碳水摄入
    }
    
    // 应用增重周期调整
    carbsAmount *= timeframeAdjustment
    
    // 如果设置了目标体重，根据目标体重和当前体重的差值微调碳水化合物量
    if (targetWeight && weight && targetWeight > weight) {
      const weightDiff = targetWeight - weight
      // 根据体重差和增重周期调整碳水量
      let adjustmentFactor = 1.0
      
      if (timeframe <= 6) {
        // 短期增重，体重差影响更大
        adjustmentFactor = Math.min(1.15, Math.max(1.05, 1 + (weightDiff * 0.015)))
      } else if (timeframe <= 12) {
        // 中期增重，体重差影响适中
        adjustmentFactor = Math.min(1.1, Math.max(1.03, 1 + (weightDiff * 0.01)))
      } else {
        // 长期增重，体重差影响较小
        adjustmentFactor = Math.min(1.05, Math.max(1.01, 1 + (weightDiff * 0.005)))
      }
      
      carbsAmount *= adjustmentFactor
    }
    
    return Math.round(carbsAmount)
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
    userData,
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