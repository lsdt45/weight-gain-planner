<!-- @format -->

<script setup lang="ts">
	import { computed } from 'vue';
	import { useRouter } from 'vue-router';
	import {
		NButton,
		NCard,
		NSpace,
		NLayout,
		NLayoutContent,
		NLayoutHeader,
		NLayoutFooter,
		NGrid,
		NGridItem,
		NH1,
		NH2,
		NText,
		NDivider,
		NStatistic,
		NDataTable,
		NDescriptions,
		NDescriptionsItem,
		NIcon,
	} from 'naive-ui';
	import { useUserStore } from '../stores/user';
	import { Line } from 'vue-chartjs';
	import {
		Chart as ChartJS,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend,
		type CoreScaleOptions,
		Scale,
	} from 'chart.js';
	// @ts-ignore
	import html2pdf from 'html2pdf.js';
	import StepsNav from '../components/StepsNav.vue';
	import { type ChartOptions } from 'chart.js';

	// 注册ChartJS组件
	ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

	const router = useRouter();
	const userStore = useUserStore();

	// 确保有计算结果，如果没有则重新计算
	if (!userStore.userData.dailyCalories) {
		userStore.calculateNutrition();
	}

	// 生成体重增长预测数据
	const weightProjection = computed(() => userStore.generateWeightProjection());

	// 图表数据
	const chartData = computed(() => ({
		labels: weightProjection.value.map((item) => `第${item.week}周`),
		datasets: [
			{
				label: '预计体重 (kg)',
				backgroundColor: 'rgba(24, 160, 88, 0.2)',
				borderColor: '#18a058',
				borderWidth: 2,
				pointBackgroundColor: '#18a058',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: '#18a058',
				data: weightProjection.value.map((item) => item.weight),
			},
		],
	}));

	// 图表选项
	const chartOptions = computed<ChartOptions<'line'>>(() => ({
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: false,
				ticks: {
					callback: function (this: Scale<CoreScaleOptions>, tickValue: string | number) {
						return typeof tickValue === 'number' ? `${tickValue} kg` : tickValue;
					},
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context: any) {
						return `体重: ${context.raw} kg`;
					},
				},
			},
		},
	}));

	// 营养素分配表格数据
	const macroColumns = [
		{
			title: '营养素',
			key: 'nutrient',
		},
		{
			title: '每日摄入量',
			key: 'amount',
		},
		{
			title: '占总热量比例',
			key: 'percentage',
		},
		{
			title: '热量贡献',
			key: 'calories',
		},
	];

	// 营养素分配表格数据
	const macroData = computed(() => [
		{
			nutrient: '蛋白质',
			amount: `${userStore.userData.protein || 0}g`,
			percentage: '20-25%',
			calories: `${(userStore.userData.protein || 0) * 4} kcal`,
		},
		{
			nutrient: '碳水化合物',
			amount: `${userStore.userData.carbs || 0}g`,
			percentage: '50-60%',
			calories: `${(userStore.userData.carbs || 0) * 4} kcal`,
		},
		{
			nutrient: '脂肪',
			amount: `${userStore.userData.fat || 0}g`,
			percentage: '20-30%',
			calories: `${(userStore.userData.fat || 0) * 9} kcal`,
		},
	]);

	// 食物建议表格数据
	const foodSuggestionColumns = [
		{
			title: '营养素',
			key: 'nutrient',
		},
		{
			title: '推荐食物来源',
			key: 'foods',
		},
	];

	const foodSuggestionData = [
		{
			nutrient: '优质蛋白质',
			foods: '鸡胸肉、鸡蛋、牛肉、鱼类、虾、豆腐、奶酪、希腊酸奶、蛋白粉',
		},
		{
			nutrient: '健康碳水化合物',
			foods: '糙米、燕麦、全麦面包、红薯、土豆、水果、豆类',
		},
		{
			nutrient: '健康脂肪',
			foods: '橄榄油、鳄梨、坚果、种子、鱼油、蛋黄',
		},
	];

	// 每日餐食建议
	const mealPlanColumns = [
		{
			title: '餐次',
			key: 'meal',
		},
		{
			title: '食物建议',
			key: 'foods',
		},
		{
			title: '热量分配',
			key: 'calories',
		},
	];

	const mealPlanData = computed(() => [
		{
			meal: '早餐',
			foods: '燕麦粥、香蕉、希腊酸奶、蛋白质奶昔、坚果',
			calories: `${Math.round((userStore.userData.dailyCalories || 0) * 0.25)} kcal (25%)`,
		},
		{
			meal: '上午加餐',
			foods: '蛋白棒、坚果、水果、酸奶',
			calories: `${Math.round((userStore.userData.dailyCalories || 0) * 0.15)} kcal (15%)`,
		},
		{
			meal: '午餐',
			foods: '糙米/全麦面食、鸡胸肉/鱼/豆腐、蔬菜、健康油脂',
			calories: `${Math.round((userStore.userData.dailyCalories || 0) * 0.25)} kcal (25%)`,
		},
		{
			meal: '下午加餐',
			foods: '蛋白质奶昔、水果、全麦面包配花生酱',
			calories: `${Math.round((userStore.userData.dailyCalories || 0) * 0.15)} kcal (15%)`,
		},
		{
			meal: '晚餐',
			foods: '瘦肉蛋白质、复合碳水、蔬菜、健康脂肪',
			calories: `${Math.round((userStore.userData.dailyCalories || 0) * 0.2)} kcal (20%)`,
		},
	]);

	// 导出PDF功能
	const exportPDF = () => {
		const element = document.getElementById('plan-content');
		const opt = {
			margin: 10,
			filename: '增重计划.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
		};

		html2pdf().set(opt).from(element).save();
	};

	const goBack = () => {
		router.push('/plan-generation');
	};

	const restartPlanner = () => {
		router.push('/');
	};
</script>

<template>
	<n-layout class="layout">
		<n-layout-header class="header">
			<div class="header-content">
				<h1 class="logo">增重计划助手</h1>
			</div>
		</n-layout-header>

		<n-layout-content class="content">
			<div id="plan-content" class="plan-content">
				<n-card class="results-card">
					<n-space vertical size="large">
						<StepsNav :current="4" />

						<div class="plan-header">
							<n-h1>您的专属增重计划</n-h1>
							<n-button secondary @click="exportPDF">
								<template #icon>
									<n-icon>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
											<path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z" />
										</svg>
									</n-icon>
								</template>
								导出PDF
							</n-button>
						</div>

						<n-descriptions bordered>
							<n-descriptions-item label="性别">
								{{ userStore.userData.gender === 'male' ? '男性' : '女性' }}
							</n-descriptions-item>
							<n-descriptions-item label="年龄">{{ userStore.userData.age || 0 }} 岁</n-descriptions-item>
							<n-descriptions-item label="身高">{{ userStore.userData.height || 0 }} cm</n-descriptions-item>
							<n-descriptions-item label="当前体重">{{ userStore.userData.weight || 0 }} kg</n-descriptions-item>
							<n-descriptions-item label="目标体重">{{ userStore.userData.targetWeight || 0 }} kg</n-descriptions-item>
							<n-descriptions-item label="计划周期">{{ userStore.userData.timeframe || 0 }} 周</n-descriptions-item>
						</n-descriptions>

						<n-divider>体重增长预测</n-divider>

						<div class="chart-container">
							<Line :data="chartData" :options="chartOptions" />
						</div>

						<n-grid :cols="24" :x-gap="12" class="stats-grid">
							<n-grid-item :span="24" :md="8">
								<n-card class="stat-card">
									<n-statistic label="基础代谢率 (BMR)" :value="userStore.userData.bmr || 0">
										<template #suffix>
											<span>kcal/天</span>
										</template>
									</n-statistic>
								</n-card>
							</n-grid-item>

							<n-grid-item :span="24" :md="8">
								<n-card class="stat-card">
									<n-statistic label="每日总消耗 (TDEE)" :value="userStore.userData.tdee || 0">
										<template #suffix>
											<span>kcal/天</span>
										</template>
									</n-statistic>
								</n-card>
							</n-grid-item>

							<n-grid-item :span="24" :md="8">
								<n-card class="stat-card highlight">
									<n-statistic label="增重所需热量" :value="userStore.userData.dailyCalories || 0">
										<template #suffix>
											<span>kcal/天</span>
										</template>
									</n-statistic>
								</n-card>
							</n-grid-item>
						</n-grid>

						<n-divider>营养素分配</n-divider>

						<n-data-table :columns="macroColumns" :data="macroData" :bordered="false" />

						<n-divider>每日餐食建议</n-divider>

						<n-data-table :columns="mealPlanColumns" :data="mealPlanData" :bordered="false" />

						<n-divider>食物推荐</n-divider>

						<n-data-table :columns="foodSuggestionColumns" :data="foodSuggestionData" :bordered="false" />

						<n-divider>增重建议</n-divider>

						<n-card class="tips-card">
							<n-space vertical>
								<n-h2>健康增重小贴士</n-h2>
								<ul class="tips-list">
									<li>保持规律饮食，不要跳过任何一餐</li>
									<li>增加餐次频率，每天吃5-6餐</li>
									<li>选择高能量密度的健康食物</li>
									<li>结合力量训练，每周至少3-4次</li>
									<li>保证充足的睡眠，每晚7-9小时</li>
									<li>每周监测体重变化，及时调整计划</li>
									<li>增重期间仍需保持适量有氧运动，维持心肺功能</li>
								</ul>
							</n-space>
						</n-card>
					</n-space>
				</n-card>
			</div>

			<div class="action-buttons">
				<n-grid :cols="24" :x-gap="12">
					<n-grid-item :span="12">
						<n-button block @click="goBack">返回</n-button>
					</n-grid-item>
					<n-grid-item :span="12">
						<n-button type="primary" block @click="restartPlanner">重新开始</n-button>
					</n-grid-item>
				</n-grid>
			</div>
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
		flex-direction: column;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.plan-content {
		width: 100%;
	}

	.results-card {
		width: 100%;
		margin-bottom: 24px;
	}

	.plan-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	.chart-container {
		height: 300px;
		width: 100%;
	}

	.stats-grid {
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

	:deep .n-layout-scroll-container {
		width: 100%;
	}

	.tips-card {
		margin-top: 16px;
	}

	.tips-list {
		padding-left: 20px;
		margin: 8px 0;

		li {
			margin-bottom: 8px;
		}
	}

	.action-buttons {
		max-width: 1000px;
		width: 100%;
		margin-top: 16px;
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
			padding: 12px;
		}

		.plan-content {
			width: 100%;
			box-sizing: border-box;
		}

		.plan-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.chart-container {
			height: 250px;
		}

		.results-card {
			width: 100%;
			box-sizing: border-box;
		}
	}
</style>
