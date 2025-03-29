<!-- @format -->

<script setup lang="ts">
	// 定义组件属性
	defineProps({
		// 当前步骤索引（从0开始）
		current: {
			type: Number,
			required: true,
		},
		// 步骤大小
		size: {
			type: String,
			default: 'small',
		},
	});
</script>

<template>
	<div class="steps-wrapper">
		<n-steps :current="current" :size="size">
			<n-step title="基本信息" description="填写个人基础数据" />
			<n-step title="设定目标" description="设置增重目标" />
			<n-step title="生成计划" description="计算营养需求" />
			<n-step title="查看结果" description="获取详细计划" />
		</n-steps>
	</div>
</template>

<style lang="scss" scoped>
	.steps-wrapper {
		overflow-x: auto;
	}
  :deep .n-step-indicator {
    transform: translateY(1px);
  }
</style>
