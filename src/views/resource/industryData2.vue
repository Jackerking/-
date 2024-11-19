<template>
  <Tabs></Tabs>
  <div class="chart-controls">
    <!-- 第一个按钮：点击时调用 goToChartA() 函数 -->
    <el-button :type="currentChart === 'a' ? 'primary' : ''" size="large" @click="goToChartA">软件行业基准数据分析</el-button>
    <!-- 第二个按钮：点击时调用 goToChartB() 函数 -->
    <el-button :type="currentChart === 'b' ? 'primary' : ''" size="large" @click="goToChartB">省行业计价数据分析</el-button>
  </div>
  <div class="chart-container">
    <el-form-item label="年份：" style="margin-bottom: 10px;"></el-form-item>
    <el-select v-model="selectedYear">
      <el-option v-for="year in years" :key="year" :label="year" :value="year"></el-option>
    </el-select>

    <div v-if="selectedYear">
      <el-checkbox-group v-model="checkedCities" class="checkbox-group">
        <el-checkbox v-for="city in uniqueCities[selectedYear]" :key="city" :label="city">{{ city }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 柱状图展示区域 -->
    <div ref="barChart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import Tabs from '@/components/tabs/resourcetabs.vue';
import { useRouter, useRoute } from 'vue-router';



const router = useRouter();
const barChart = ref(null);
const selectedYear = ref(null);
const checkedCities = ref([]);
const years = ref([]);
const uniqueCities = ref({});
const rawData = ref([]);
const currentChart = ref('b'); // 默认显示A图表
// 函数：跳转到 'chartA' 页面
const goToChartA = () => {
  currentChart.value = 'a'; // 更新当前图表为 A
  router.push('/industryData'); // 跳转到 chartA 页面
};
// 函数：跳转到 'chartB' 页面
const goToChartB = () => {
  currentChart.value = 'b'; // 更新当前图表为 B
  router.push('/industryData2'); // 跳转到 chartB 页面
};

// 初始化柱状图
const initBarChart = () => {
  if (!selectedYear.value || checkedCities.value.length === 0) return;

  const chart = echarts.init(barChart.value);
  const option = {
    title: { text: '省行业计价数据分析' },
    xAxis: { type: 'category', data: checkedCities.value },
    yAxis: { type: 'value' },
    series: [
      {
        data: checkedCities.value.map(city =>
          rawData.value.find(item => item.year === selectedYear.value && item.city === city)?.cost || 0
        ),
        type: 'bar'
      }
    ]
  };
  chart.setOption(option);
};

// 从 API 获取数据
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:9000/basicRate/getAll');
    rawData.value = response.data;
    
    // 处理年份和城市数据
    years.value = [...new Set(rawData.value.map(item => item.year))].sort();
    rawData.value.forEach(item => {
      if (!uniqueCities.value[item.year]) {
        uniqueCities.value[item.year] = new Set();
      }
      uniqueCities.value[item.year].add(item.city);
    });

    if (selectedYear.value && uniqueCities.value[selectedYear.value]) {
      checkedCities.value = Array.from(uniqueCities.value[selectedYear.value]);
      nextTick(() => {
        initBarChart();
      });
    }
  } catch (error) {
    console.error('Fetching data failed:', error);
  }
};

// 监听年份或选中的城市变化，更新柱状图
watch([() => selectedYear.value, () => checkedCities.value], () => {
  nextTick(() => {
    initBarChart();
  });
});

// 页面加载时初始化数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.chart-container {
  padding: 20px;
}

.chart {
  width: 100%;
  height: 400px;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.chart-controls {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
 
  padding: 10px;
}
</style>
