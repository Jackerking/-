<template>
  <div class="header-title">
        <span><button class="back-button" @click="goBack">
        &#8592; </button></span>
        <span>工作量评估</span>
  </div>
  <div class="header-container">
      <el-steps
        :active="activeStep"
        align-center
        finish-status="success"
        class="steps-container"
      >
        <!-- 步骤条内容 -->
        <el-step title="GSC权值输入" name="FunctionPointEvaluation"></el-step>
        <el-step title="功能点评估" name="FunctionPointsIdentify"></el-step>
        <el-step title="工作量评估" name="effortAssessmentmenu"></el-step>
        <el-step title="风险评估" name="riskAssessment"></el-step>
        <el-step title="评估结果" name="standards"></el-step>
        
      </el-steps>
  </div>
  <div>
    <!-- 造价标准选择 -->
    <div class="standard-container">
      <label for="standard-select">造价标准:</label>
      <el-select v-model="selectedStdId" placeholder="请选择造价标准" class="standard-select" @change="handleStdIdChange" :clearable="false"
        clearable>
        <el-option v-for="std in standardOptions" :key="std.value" :label="std.label" :value="std.value" />
      </el-select>
      <!-- 新标准保存按钮 -->
      <el-button type="primary" @click="openNewStandardDialog">保存造价标准</el-button>
      <el-button type="primary" @click="go">下一步</el-button>
    </div>

    <div v-for="(factor, index) in factors" :key="index" class="factor-container">
      <label :for="factor.name">{{ factor.label }}:</label>
      <el-select v-model="factor.selectedValue" :placeholder="`请选择${factor.label}`" @change="handleSelectionChange(index) "   :clearable="false"
        class="factor-select" clearable>
        <el-option v-for="option in factor.options" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <!-- 展示数字 -->
      <span class="value-display">{{ factor.selectedValue }}</span>

      <el-button type="primary" @click="showEditDialog(index)" style="margin-left: 40px;height: 30px;">
        <el-icon style="vertical-align: middle">
          <Edit />
        </el-icon>
        <span style="vertical-align: middle"> 编辑 </span>
      </el-button>

      <!-- 编辑对话框 -->
      <el-dialog v-model="editDialogVisible[index]" :title="`编辑 ${factor.label} 选项`" width="30%">
        <el-form>
          <div v-for="(option, optionIndex) in factor.tempEditOption" :key="optionIndex" class="factor-form-item">
            <el-form-item :label="`选项 ${optionIndex + 1}`" class="form-item">
              <el-input v-model="factor.tempEditOption[optionIndex].label" placeholder="请输入选项标签"></el-input>
              <el-input v-model.number="factor.tempEditOption[optionIndex].value" placeholder="请输入选项值" type="number"
                step="0.1" style="margin-top: 10px;" />
            </el-form-item>
            <el-button type="danger" size="mini" class="delete-btn" @click="confirmRemoveOption(index, optionIndex)">
              删除选项
            </el-button>
          </div>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="addOption(index)" type="success">新增选项</el-button>
            <el-button type="primary" @click="saveOptions(index)">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div class="pdr-container">
      <label for="pdr-input">PDR：</label>
      <el-input v-model.number="pdrValue" placeholder="请输入PDR值" type="number" step="0.1" min="0.1" max="100"
        style="width: 100px; margin-left: 0px;" />

      <label for="pdr-input" style="margin-left: 50px;">平均人力成本：</label>
      <!-- Cascader 组件，用于选择省份和年份 -->
      <el-cascader v-model="selectedOption" :options="cascaderOptions" placeholder="请选择省份和年份" :props="cascaderProps"
        @change="onCascaderChange" class="custom-cascader" style="width: 200px;" />

      <span class="value-display">{{ cost }}</span>



    </div>

    <!-- 新标准的输入弹窗 -->
    <el-dialog title="保存为新的造价标准" v-model="isNewStandardDialogVisible" width="30%">
      <el-form :model="newStandard" ref="newStandardForm" label-width="120px">
        <el-form-item label="标准名称" prop="stdName" :rules="[{ required: true, message: '标准名称不能为空', trigger: 'blur' }]">
          <el-input v-model="newStandard.stdName" placeholder="请输入标准名称"></el-input>
        </el-form-item>

        <el-form-item label="PDR" prop="pdr" :rules="[{ required: true, message: 'PDR不能为空', trigger: 'blur' }]">
          <el-input v-model.number="newStandard.pdr" type="number" placeholder="请输入PDR"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="intro" :rules="[{ required: true, message: '简介不能为空', trigger: 'blur' }]">
          <el-input v-model="newStandard.intro" placeholder="请输入简介"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]">
          <el-select v-model="newStandard.type" placeholder="请选择类型">
            <el-option label="自定义" value="history"></el-option>
            <el-option label="官方" value="official"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="启用状态" prop="enable" :rules="[{ required: true, message: '请选择启用状态', trigger: 'blur' }]">
          <el-select v-model="newStandard.enable" placeholder="请选择启用状态">
            <el-option label="启用" value="enabled"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeNewStandardDialog">取 消</el-button>
        <el-button type="primary" @click="saveStandardAndFactors">确 定</el-button>
      </div>
    </el-dialog>

    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const factors = ref([
  { name: 'SF', label: '规模调整', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'BD', label: '业务领域', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'QR', label: '质量特性', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'AT', label: '应用类型', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'SL', label: '开发语言', selectedValue: '', options: [], tempEditOption: [] },
  { name: 'DT', label: '团队背景', selectedValue: '', options: [], tempEditOption: [] }
]);

const editDialogVisible = ref(factors.value.map(() => false));
const chartContainer = ref(null);
const factorTypes = ['SF', 'BD', 'QR', 'AT', 'SL', 'DT'];
const selectedStdId = ref(''); // 当前选择的造价标准 ID
const standardOptions = ref([]); // 下拉框的标准选项
const isNewStandardDialogVisible = ref(false); // 控制弹窗的显示
const pdrValue = ref(0); // 用于存储 PDR 的值
const newStandard = ref({
  stdName: '',
  pdr: 0,
  intro: '',
  type: 'history', // 默认类型为 'history'
  enable: 'enabled' // 默认启用状态为 'enabled'
});

//平均人力成本下拉框
const selectedOption = ref('');
const provinces = ref([]);
const years = ref([]); // 用来存储年份数据
const cost = ref<number | null>(null);  // 初始化 cost 为 null
  const activeStep = ref(2); // 当前步骤索引
const projectInfo = loadProjectInfo();
const project=ref()
const router = useRouter();




// Cascader 组件的 props 配置
const cascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children'
};

const loadProvinces = async () => {
  try {
    const response = await axios.get('http://localhost:9000/basicRate/getProvincesWithYears');
    console.log(response.data);  // 查看返回的数据结构
    provinces.value = response.data; // 假设接口返回数据格式是 { name: '省份', years: [年份数组] }
    years.value = provinces.value[0].years || []; // 默认加载第一个省份的年份
  } catch (error) {
    console.error('Error loading provinces:', error);
  }
};

const cascaderOptions = computed(() => {
  return provinces.value.map(province => ({
    value: province.name,
    label: province.name,
    children: province.years.map(year => ({
      value: year,
      label: year.toString()
    }))
  }));
});

// 当用户选择了省份和年份
const onCascaderChange = async (value: (string | number)[]) => {
  if (value.length === 2) {
    const [province, year] = value;
    console.log(`选中的值: ${province} / ${year}`);
    try {
      const response = await axios.get(`http://localhost:9000/basicRate/getCost`, {
        params: { province, year }
      });
      cost.value = response.data; // 更新成本数据
    } catch (error) {
      console.error('Error fetching cost data:', error);
      cost.value = null;
    }
  }
};


// 打开弹窗
const openNewStandardDialog = () => {
  isNewStandardDialogVisible.value = true;
  newStandard.value.pdr = pdrValue.value;
};

// 关闭弹窗
const closeNewStandardDialog = () => {
  isNewStandardDialogVisible.value = false;
};

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

//拉取造价标准列表（显示在顶部下拉框中）
const fetchStandardOptions = async () => {
  try {
    const response = await axios.get('http://localhost:9000/CostStandard/list');
    // 假设返回数据格式为 { standards: [{ stdId: '123', name: '标准1' }, ...] }
    standardOptions.value = response.data.CostStandards.map(standard => ({
      label: standard.stdName,
      value: standard.stdId
    }));
    if (standardOptions.value.length > 0) {
      selectedStdId.value = standardOptions.value[0].value; // 默认选中第一个
      handleStdIdChange(selectedStdId.value); // 加载对应因子
    }
  } catch (error) {
    console.error('获取造价标准失败:', error);
  }
};
// 返回上一页面
const goBack = () => {
      router.push('/FunctionPointsIdentify');  // 使用路径进行跳转
    };
// 跳转下一个一页面
const go = () => {
      CalculateAndSaveAE();
    };

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

  // 验证：检查是否有未填写的选项
  const hasEmptyFields = factor.tempEditOption.some(option => {
    return option.label.trim() === '' || option.value === null || option.value === '';
  });

  if (hasEmptyFields) {
    ElMessage({
      type: 'warning',
      message: '选项内容和值不能为空，请检查后再保存！',
    });
    return; // 阻止保存
  }

  // 如果所有选项填写完整，则保存
  factor.options = factor.tempEditOption.map(option => ({
    label: option.label,
    value: option.value
  }));

  ElMessage({
    type: 'success',
    message: '修改成功！',
  });

  factor.selectedValue = ''; // 清空已选值
  editDialogVisible.value[index] = false; // 关闭对话框
  updateChart(); // 更新图表
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
    }],
        // 添加水平线
        markLine: {
      data: [
        {
          yAxis: 1, // 设定水平线的位置
          label: {
            show: true,
            position: 'insideEndTop', // 使文字标注显示在水平线的上方
            formatter: '1', // 文字内容为 1
          },
          lineStyle: {
            type: 'solid',
            color: '#1f0000', // 可以根据需要修改颜色
            width: 2
          }
        }
      ]
    }
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

// 添加新选项
const addOption = (index: number) => {
  const factor = factors.value[index];
  const newOption = {
    label: '',
    value: 0
  };
  factor.tempEditOption.push(newOption);
};

// 删除选项
const removeOption = (index: number, optionIndex: number) => {
  const factor = factors.value[index];
  factor.tempEditOption.splice(optionIndex, 1);
};

// 确认并删除选项
const confirmRemoveOption = (index: number, optionIndex: number) => {
  ElMessageBox.confirm(
    '确定要删除这个选项吗？',
    '提示',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      removeOption(index, optionIndex); // 删除选项
      ElMessage({ type: 'success', message: '选项已删除' });
    })
};


const handleStdIdChange = async (newStdId) => {
  if (!newStdId) return;
  // 清空所有因子的选项内容和选中值
  factors.value.forEach(factor => {
    factor.selectedValue = ''; // 清空选中的值
    factor.options = []; // 清空选项
    factor.tempEditOption = []; // 清空编辑临时选项
  });

  // 当造价标准改变时，重新加载所有因子的选项
  factorTypes.forEach(factorType => {
    fetchFactorOptions(newStdId, factorType);
  });

  // 获取选中标准的 PDR 值
  try {
    const response = await axios.get(`http://localhost:9000/CostStandard/get`, { params: { stdId: newStdId } });
    const standardData = response.data.CostStandard; // 假设返回数据中包含 CostStandard
    pdrValue.value = standardData.pdr || 0; // 更新 PDR 值
  } catch (error) {
    console.error("获取PDR失败:", error);
  }
};

// 保存标准和因子选项
const saveStandardAndFactors = async () => {
  try {

    // 1. 验证标准名称和简介不能为空
    if (!newStandard.value.stdName || !newStandard.value.intro) {
      ElMessage({
        type: 'error',
        message: '标准名称和简介不能为空！',
      });
      return;  // 阻止保存操作
    }

    // 1. 保存标准
    const response = await axios.post('http://localhost:9000/CostStandard/addForStdId', newStandard.value);
    console.log(response.data)
    const newStdId = response.data.stdId; // 假设返回的数据中有 stdId


    if (!newStdId) {
      throw new Error("标准保存失败，未返回 stdId");
    }

    // 2. 保存因子选项
    const factorRequests = factors.value.map(factor => {
      const factorData = factor.tempEditOption.map(option => ({
        stdId: newStdId, // 使用返回的 stdId
        factor_type: factor.name,
        factor_name: option.label,
        factor_value: option.value,
      }));
      console.log("factorData:" + factorData.values);

      // 发送因子选项保存请求
      return axios.post('http://localhost:9000/Factor/addFactors', factorData);
    });

    // 等待所有因子保存完成
    await Promise.all(factorRequests);

    // 显示成功消息
    ElMessage({
      type: 'success',
      message: '标准和因子选项已保存成功！',
    });

    fetchStandardOptions(); // 刷新标准选项

    // 清空当前选择，或者可以执行后续操作
    closeNewStandardDialog(); // 关闭弹窗

  } catch (error) {
    console.error("保存失败:", error);
    ElMessage({
      type: 'error',
      message: '保存失败，请重试！',
    });
  }
};

const CalculateAndSaveAE = async () => {

  if (isNextStepDisabled.value) {
    ElMessage({
      type: 'error',
      message: '请填写完整信息',
    })

    return;
  }

  try {
    const params = {
      projectId: project.value.projectId,  // 项目ID
      S: project.value.adjustedFunctionPoints,  // 其他参数
      pdr: pdrValue.value,
      personnelCosts: cost.value,
      SF: parseFloat(factors.value.find(factor => factor.name === 'SF')?.selectedValue || ''),
      BD: parseFloat(factors.value.find(factor => factor.name === 'BD')?.selectedValue || ''),
      QR: parseFloat(factors.value.find(factor => factor.name === 'QR')?.selectedValue || ''),
      AT: parseFloat(factors.value.find(factor => factor.name === 'AT')?.selectedValue || ''),
      SL: parseFloat(factors.value.find(factor => factor.name === 'SL')?.selectedValue || ''),
      DT: parseFloat(factors.value.find(factor => factor.name === 'DT')?.selectedValue || ''),
      stdId: selectedStdId.value, // 造价标准ID
    };

    console.log("params:", JSON.stringify(params, null, 2));

    // 通过 URL 查询参数发送请求
    const response = await axios.post('http://localhost:9000/Factor/updateProject', params, {
      headers: {
        'Content-Type': 'application/json', // 确保请求头为 JSON 格式
      },
    });

    if (response.data.status) {
      ElMessage({
        type: 'success',
        message: 'AE计算并保存成功！',
      });
    } else {
      ElMessage({
        type: 'error',
        message: 'AE计算并保存失败，请重试！',
      });
    }
  } catch (error) {
    console.error('AE计算并保存失败:', error);
    ElMessage({
      type: 'error',
      message: 'AE计算并保存失败，请重试！',
    });
  }

  router.push('/riskAssessment');
};



// 从 localStorage 加载项目数据
function loadProjectInfo() {
  const storedProject = localStorage.getItem('savedProject');
  return storedProject ? JSON.parse(storedProject) : null;
}

const isNextStepDisabled = computed(() => {
  // 检查所有因子是否都选择了值
  const allSelected = factors.value.every(factor => factor.selectedValue !== '');
  // 检查是否选择了造价标准
  const isStdSelected = selectedStdId.value !== '';
  // 检查PDR值是否大于0
  const isPdrValid = pdrValue.value > 0;
  // 检查是否选择了平均人力成本
  const isCostSelected = selectedOption.value !== '';
  
  return !(allSelected && isStdSelected && isPdrValid && isCostSelected);
});


onMounted(async() => {
  fetchStandardOptions(); // 加载造价标准
  loadProvinces();  // 加载省份和年份数据
  factorTypes.forEach(factorType => {
    fetchFactorOptions(selectedStdId.value, factorType);
  });
  initChart();
  // 准备请求体
const requestBody = { projectName: projectInfo.projectName };
    // 发起后端请求
    const response = await axios.post('http://localhost:9000/project/find', requestBody);
    if (response.data.isOk) {
        console.log(response.data.project);
         project.value = response.data.project;
    }

});
</script>


<style lang="scss" scoped>
.edit-icon:hover {
  color: #89add4;
}

.factor-container {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #333;

  label {
    margin-right: 20px;
    margin-left: 45px;
    width: 150px;
    text-align: right;
  }

  .factor-select {
    width: 300px;
    min-width: 300px;
    max-width: 300px;
  }


}


.value-display {
  display: inline-block;
  /* 让其成为块级元素，以便添加内边距等 */
  margin-left: 20px;
  /* 调整左侧间距 */
  padding: 5px 10px;
  /* 内边距使背景更美观 */
  background-color: #f6f3f3;
  /* 浅灰色背景 */
  color: #333;
  /* 字体颜色 */
  border-radius: 4px;
  /* 圆角 */
  font-weight: bold;
  /* 字体加粗 */
  min-width: 80px;
  /* 确保有最小宽度，避免值太小 */
  height: 20px;
  /* 固定高度 */
  line-height: 25px;
  /* 使文本垂直居中 */
  text-align: center;
  /* 使文本居中 */
  word-wrap: break-word;
  /* 防止长数字溢出 */
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}

/* 弹窗样式调整 */
.factor-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .form-item {
    flex-grow: 1;
  }

  .delete-btn {
    margin-left: 10px;
    font-size: 12px;
    padding: 3px 8px;
    height: 28px;
    align-self: flex-start;
    /* 删除按钮顶部对齐 */
  }
}

/* 弹窗底部按钮调整 */
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 将新增按钮和其他按钮分开 */

  .spacer {
    flex: 1;
    /* 用来分隔新增选项按钮和取消/确定按钮 */
  }

  .el-button {
    margin-left: 0px;
    height: 30px;
    /* 设置统一按钮高度 */
  }
}

/* 将新增按钮置于左侧 */
.dialog-footer .el-button:first-child {
  margin-left: 20;
}

/* 使用 ::v-deep 来确保样式应用到 Element Plus 的组件 */
::v-deep .el-dialog__body {
  max-height: 350px;
  overflow-y: auto;
}

.standard-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 20px;
  /* 增加左侧的间距 */

  label {
    margin-right: 20px;
    margin-left: 20px;
    font-weight: bold;
    color: #333;
  }

  .standard-select {
    width: 300px;
    min-width: 300px;
    max-width: 300px;
  }

  .el-button {
    margin-left: 30px;
    height: 30px;
    /* 设置统一按钮高度 */
    background-color: rgb(0, 174, 0) !important;
    /* 设置按钮背景颜色为绿色 */
    color: white !important;
    /* 设置按钮文字颜色为白色 */
  }

}

.pdr-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 20px;
}

.pdr-container label {
  margin-left: 130px;
  color: #333;
}

.pdr-container .el-input {
  width: 15px;
  margin-left: 20px;
}
/* 返回按钮样式 */
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start; /* 左对齐 */
  background: none;
  border: none;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 5px 10px;
  font-weight: bold;
}
.header-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
      text-align: left; /* 左对齐 */
    }
    .header-container {
  max-width: 1000px; /* 根据需要调整宽度 */
  margin: 0 auto;   /* 居中对齐 */
}
</style>

