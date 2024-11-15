<template>
  <div>
    <div v-for="(factor, index) in factors" :key="index" class="factor-container">
      <label :for="factor.name">{{ factor.label }}:</label>
      <el-select
        v-model="factor.selectedValue"
        :placeholder="`请选择${factor.label}`"
        @change="handleSelectionChange(index)"
        class="factor-select"
        clearable
      >
        <el-option v-for="option in factor.options" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <span class="value-display">{{ factor.selectedValue }}</span>
      <el-button type="primary" size="small" @click="showEditDialog(index)">编辑选项</el-button>

      <!-- 编辑对话框 -->
      <el-dialog v-model="editDialogVisible[index]" :title="`编辑 ${factor.label} 选项`" width="30%">
        <el-form>
          <el-form-item v-for="(option, optionIndex) in factor.options" :key="optionIndex" :label="`选项 ${optionIndex + 1}`">
            <el-input v-model="factor.tempEditOption[optionIndex].label" placeholder="请输入选项标签"></el-input>
            <el-input v-model.number="factor.tempEditOption[optionIndex].value" placeholder="请输入选项值" type="number" step="0.1" style="margin-top: 10px;" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelEdit(index)">取 消</el-button>
            <el-button type="primary" @click="saveOptions(index)">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- ECharts 条形图 -->
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

const factors = ref([
  { name: 'SF', label: 'SF', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'BD', label: 'BD', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'QR', label: 'QR', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'AT', label: 'AT', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'SL', label: 'SL', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'DT', label: 'DT', selectedValue: '', options: [], tempEditOption: [] }
]);

const editDialogVisible = ref(factors.value.map(() => false));
const chartContainer = ref(null);
const stdId = '123';
const factorTypes = ['SF', 'BD', 'QR', 'AT', 'SL', 'DT'];

const fetchFactorOptions = async (stdId: string, factorType: string) => {
  try {
    const response = await axios.get(`http://localhost:9000/Factor/find`, {
      params: { factor_type: factorType, stdId: stdId }
    });

    const factorData = response.data.Factors;
    if (Array.isArray(factorData)) {
      const factor = factors.value.find(factor => factor.name === factorType);
      if (factor) {
        factor.options = factorData.map(item => ({
          label: item.factor_name,
          value: item.factor_value
        }));
        // 初始化 tempEditOption 为选项数量
        factor.tempEditOption = factor.options.map(option => ({
          label: option.label,
          value: option.value
        }));
      }
    }
  } catch (error) {
    console.error('获取因子选项失败:', error);
  }
};

onMounted(() => {
  factorTypes.forEach(factorType => {
    fetchFactorOptions(stdId, factorType);
  });
  initChart();
});

const showEditDialog = (index: number) => {
  const factor = factors.value[index];
  // 在弹窗打开时显示当前因子的所有选项
  factor.tempEditOption = factor.options.map(option => ({
    label: option.label,
    value: option.value
  }));
  editDialogVisible.value[index] = true;
};

const saveOptions = (index: number) => {
  const factor = factors.value[index];
  // 更新 options 中的值
  factor.options.forEach((option, optionIndex) => {
    option.label = factor.tempEditOption[optionIndex].label;
    option.value = factor.tempEditOption[optionIndex].value;
  });

  factor.selectedValue = ""; // 清空已选值

  editDialogVisible.value[index] = false;

  updateChart();
};

const cancelEdit = (index: number) => {
  editDialogVisible.value[index] = false;
};

const handleSelectionChange = (index: number) => {
  updateChart();
};

const initChart = () => {
  const chart = echarts.init(chartContainer.value);
  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: ['SF', 'BD', 'QR', 'AT', 'SL', 'DT'],
      axisLabel: { interval: 0 }
    },
    yAxis: { type: 'value' },
    series: [{
      name: '选项值',
      type: 'bar',
      barWidth: 60,
      data: factors.value.map(factor => factor.selectedValue || 0),
      emphasis: { focus: 'series' }
    }]
  };
  chart.setOption(chartOptions);
};

const updateChart = () => {
  const chart = echarts.getInstanceByDom(chartContainer.value);
  const newData = factors.value.map(factor => factor.selectedValue || 0);
  chart.setOption({
    series: [{ data: newData }]
  });
};
</script>

<style lang="scss" scoped>
.factor-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #333;

  label {
    margin-right: 10px;
    margin-left: 30;
    width: 100px;
    text-align: right;
  }

  .factor-select {
    width: 150px;
    min-width: 150px;
    max-width: 150px;
  }

  .value-display {
    font-weight: bold;
    color: #333;
    width: 100px;
    text-align: left;
    margin-left: 40px;
  }

  .el-button {
    margin-left: 10px;
  }
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
