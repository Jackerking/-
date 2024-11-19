<template>
  <Tabs></Tabs>
  <div class="grid-container">
    <div class="chart-controls">
    <!-- 第一个按钮：点击时调用 goToChartA() 函数 -->
    <el-button :type="currentChart === 'a' ? 'primary' : ''" size="large" @click="goToChartA">软件行业基准数据分析</el-button>
    <!-- 第二个按钮：点击时调用 goToChartB() 函数 -->
    <el-button :type="currentChart === 'b' ? 'primary' : ''" size="large" @click="goToChartB">省行业计价数据分析</el-button>
  </div>
    <div class="charts-row">
      <div class="chart-wrapper">
        <h2 v-if="currentChart === 'a'" ref="CSBMKtitle">CSBMK-北京软件造价评估技术创新联盟</h2>
        <div v-if="currentChart === 'a'" ref="CSBMK" class="chart"></div>
        <div v-if="currentChart === 'b'" class="chart">
          <div>
            <el-form-item label="年份：" style="margin-bottom: 10px;"></el-form-item>
            <el-select v-model="selectedYear">
              <el-option v-for="year in years" :key="year" :label="year" :value="year"></el-option>
            </el-select>
            <div v-if="selectedYear">
              <el-checkbox-group v-model="checkedCities" class="checkbox-group">
                <el-checkbox v-for="city in uniqueCities[selectedYear]" :key="city" :label="city">{{ city }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div ref="barChart" class="chart"></div>
        </div>
      </div>
      <div class="chart-wrapper">
        <h2 v-if="currentChart === 'a'" ref="CSBSGtitle">CSBSG-中国软件行业协会软件造价分会</h2>
        <div v-if="currentChart === 'a'" ref="CSBSG" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import Tabs from '@/components/tabs/resourcetabs.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const CSBMK = ref(null);
const CSBSG = ref(null);
let CSBMKChart = null;
let CSBSGChart = null;
const currentChart = ref('a'); // 默认显示A图表
const barChart = ref(null); // 定义柱状图的ref
const selectedYear = ref(null);
const checkedCities = ref([]);
const years = ref([]);
const uniqueCities = ref({});
const rawData = ref([]);

const optionCSBMK = {
  title: { text: '软件开发基准人月费率' },
  tooltip: { trigger: 'axis' },
  legend: { 
  data: ['北京', '上海', '西安', '沈阳'],
  right: '10%', // 将图例右对齐
  top: '10%',   },
  grid: { left: '10%', right: '10%', top: '20%', bottom: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
  },
  yAxis: { type: 'value' },
  series: [
    { name: '北京', type: 'line', data: [24300, 25500, 27168, 28767, 30134, 30906, 32343, 32597, 32129], smooth: true },
    { name: '上海', type: 'line', data: [24400, 25400, 26932, 28548, 29508, 30778, 31036, 31166, 31207], smooth: true },
    { name: '西安', type: 'line', data: [null, 19500, 21840, 23042, 23596, 24394, 25474, 26025, 25913], connectNulls: true },
    { name: '沈阳', type: 'line', data: [null, 20000, 21528, 22035, 22456, 23362, 22576, 22796, 22521], connectNulls: true }
  ]
};
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

const optionCSBSG = JSON.parse(JSON.stringify(optionCSBMK)); // 复制配置用于另一个图表

const initCharts = () => {
  if (CSBMK.value) {
    CSBMKChart = echarts.init(CSBMK.value);
    CSBMKChart.setOption(optionCSBMK);
  }
  if (CSBSG.value) {
    CSBSGChart = echarts.init(CSBSG.value);
    CSBSGChart.setOption(optionCSBSG);
  }
};

const showChart = (chart) => {
  currentChart.value = chart;
  nextTick(() => {
    if (chart === 'a') initCharts();
  });
};

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:9000/basicRate/getAll');
    rawData.value = response.data;
    years.value = [...new Set(rawData.value.map(item => item.year))].sort();
    rawData.value.forEach(item => {
      if (!uniqueCities.value[item.year]) {
        uniqueCities.value[item.year] = new Set();
      }
      uniqueCities.value[item.year].add(item.city);
    });
    if (selectedYear.value && uniqueCities.value[selectedYear.value]) {
      checkedCities.value = Array.from(uniqueCities.value[selectedYear.value]);
      initChart();
    }
  } catch (error) {
    console.error('Fetching data failed:', error);
  }
};


onMounted(() => {
  initCharts();
  fetchData();
});
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
  gap: 20px;
}

.chart-controls {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
 
  padding: 10px;
}

.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-wrapper {
  flex: 1;
  min-width: 45%;
  max-width: 45%;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
</style>
