<script setup lang="ts">
import { onMounted, ref, watch,reactive } from 'vue';
import * as echarts from 'echarts';
import Tabs from '@/components/tabs/tabs.vue';
import { useRouter, useRoute } from 'vue-router';
import VueOfficeDocx from "@vue-office/docx";
import "@vue-office/docx/lib/index.css";
import { ElMessage,ElMessageBox } from 'element-plus';
import axios from 'axios';
  axios.defaults.baseURL = '/web';

// 通过 ref 创建七个风险等级的变量
const highRisk = ref(0);
const mediumRisk = ref(0);
const lowRisk = ref(0);
const veryHighRisk = ref(0);
const veryLowRisk = ref(0);
const criticalRisk = ref(0);
const negligibleRisk = ref(0);


// 控制总体风险等级的显示
const showOverallRisk = ref(false);
const overallRiskLevel = ref("");
const overallRiskValue = ref("");

// 控制路由
const router = useRouter();
const route = useRoute();
const totalCost = ref(0); // 数字变量的初始值为 0
  //定义成本
const SDC = ref(0); // 数字变量的初始值为 0

// 点击按钮计算总体风险等级
const calculateOverallRisk = () => {
  showOverallRisk.value = true;
  const totalRiskValues = [
    highRisk.value,
    mediumRisk.value,
    lowRisk.value,
    veryHighRisk.value,
    veryLowRisk.value,
    criticalRisk.value,
    negligibleRisk.value
  ];

  // 计算平均值
  const averageRisk = totalRiskValues.reduce((a, b) => a + b, 0) / totalRiskValues.length;
  overallRiskLevel.value = getRiskLevel(averageRisk);


  // 根据总体风险等级设置总体风险数值
  if (overallRiskLevel.value === "高") {
    overallRiskValue.value = "1.4";
  } else if (overallRiskLevel.value === "中") {
    overallRiskValue.value = "1.2";
  } else if (overallRiskLevel.value === "低") {
    overallRiskValue.value = "1.0";
  }
};

const nextStep = async () => {
   totalCost.value=SDC.value*Number(overallRiskValue.value);
  try {
    // 向后端发送更新项目的请求
    const response = await axios.post('/project/RSK',null, {params:{
      projectId:projectInfo.projectId, // 项目 ID
      RSK:overallRiskValue.value,       // 要更新的 RSK 值
      totalCost:totalCost.value
    }
    });
    console.log('服务器响应:', response.data);
    // 检查后端响应
    if (response.data.isOk) {
      // 显示成功消息
      ElMessage.success('RSK保存成功');
      //保存各类风险数据
      const riskData = {
        highRisk: highRisk.value,
        mediumRisk: mediumRisk.value,
        lowRisk: lowRisk.value,
        veryHighRisk: veryHighRisk.value,
        veryLowRisk: veryLowRisk.value,
        criticalRisk: criticalRisk.value,
        negligibleRisk: negligibleRisk.value,
      };
      localStorage.setItem('riskData', JSON.stringify(riskData));
      
      // 请求成功后跳转到评估结果页面
      router.push({ path: '/Standards' });
    } else {
      // 如果后端返回失败状态，抛出错误以显示在前端
      ElMessage.error('RSK保存失败');
    }
  } catch (error) {
    ElMessage.error('RSK保存失败');
  }
};
// 初始化 ECharts 图表
let myChart: echarts.ECharts;
const projectInfo = loadProjectInfo();
const updateChart = () => {
  const option = {
    title: {
      text: '风险评估饼图',
      left: '30%',
      textStyle: {
        fontSize: 18  // 设置标题字体大小
      },
      padding: [20, 0, 5, 0]
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      textStyle: {
        fontSize: 14  // 设置提示框字体大小
      }
    },
    legend: {
      orient: 'vertical',
      right: 'right',        // 设置图例距离右侧 10%
       top: '20%',          // 设置图例距离顶部 20%
      data: ['需求变更风险', '预算超支风险', '人员短缺和技能不匹配风险', '项目延误风险', '软件质量风险', '软件进度风险', '项目管理风险'],
      textStyle: {
        fontSize: 12  // 设置图例字体大小为16，可以根据需要调整
      }
    },
    series: [
      {
        name: '风险等级',
        type: 'pie',
        radius: '50%',
        center: ['35%', '50%'],
        data: [
          { value: highRisk.value, name: '需求变更风险' },
          { value: mediumRisk.value, name: '预算超支风险' },
          { value: lowRisk.value, name: '人员短缺和技能不匹配风险' },
          { value: veryHighRisk.value, name: '项目延误风险' },
          { value: veryLowRisk.value, name: '软件质量风险' },
          { value: criticalRisk.value, name: '软件进度风险' },
          { value: negligibleRisk.value, name: '项目管理风险' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          fontSize: 14  // 设置饼图标签的字体大小
        }
      }
    ]
  };

  myChart.setOption(option);
};
function loadProjectInfo() {
  // 从 localStorage 获取 'project' 键的数据
  const storedProject = localStorage.getItem('savedProject');
  
  // 如果本地存储中有 'userInfo' 数据
  if (storedProject) {
    // 将 JSON 字符串转换成 JavaScript 对象并返回
    return JSON.parse(storedProject);
  } else {
    // 如果没有找到 'userInfo' 数据，则返回 null
    // 可以选择性地进行跳转到登录页面（此行代码被注释掉了）
    // window.location.href = '/login'; // 取消注释以实际跳转
    return null;
  }
}

onMounted(async() => {
  const chartDom = document.getElementById('pie-chart')!;
  myChart = echarts.init(chartDom);
  updateChart();
  try {
    // 准备请求体
    const requestBody = {
      projectName: projectInfo.projectName // 将 projectName 放入请求体
    };
    const response = await axios.post('/project/find',requestBody);
    console.log("hahah")
    if (response.data.isOk) {
      // 获取返回的项目数据
      const project = response.data.project;
      // 从返回的项目数据中提取 file_path
      const filePath = project.filePath;
      // 如果 filePath 存在，并且包含指定的前缀，则替换掉前缀
      const prefix = "C:\\Users\\93229\\Desktop\\aaaaa\\ProductConsrtuct_frontend\\public";
      if (filePath && filePath.startsWith(prefix)) {
        docxSrc.value = filePath.replace(prefix, '');  // 去掉指定的前缀
      }
      // 确保去掉前缀后的 filePath 是字符串类型
      docxSrc.value = String(docxSrc.value);
      //计算SDC
      SDC.value=Number(project.ae)*Number(project.personnelCosts)+2;
      //查看是否已有数据
      const savedRiskData = localStorage.getItem('riskData');
      if (savedRiskData) {
        const parsedData = JSON.parse(savedRiskData);
        // 如果 localStorage 中有数据，使用保存的数据
        highRisk.value = parsedData.highRisk;
        mediumRisk.value = parsedData.mediumRisk;
        lowRisk.value = parsedData.lowRisk;
        veryHighRisk.value = parsedData.veryHighRisk;
        veryLowRisk.value = parsedData.veryLowRisk;
        criticalRisk.value = parsedData.criticalRisk;
        negligibleRisk.value = parsedData.negligibleRisk;
      }
    } else {
      ElMessage.error('获取项目数据失败');
    }
  } catch (error) {
    ElMessage.error('获取项目数据失败');
  }
});

// 使用 watch 监听变量的变化，实时更新饼图
watch([highRisk, mediumRisk, lowRisk, veryHighRisk, veryLowRisk, criticalRisk, negligibleRisk], updateChart);

// 根据数值返回风险等级
const getRiskLevel = (risk: any) => {
  if (risk < 10) {
    return '低';
  } else if (risk >= 10 && risk <= 20) {
    return '中';
  } else {
    return '高';
  }
};
// 设置本地文件的路径
let docxSrc = ref(); // 示例文件路径
</script>

<template>
  <Tabs></Tabs>
  <div class="container">
    <!-- 左侧文档区域 -->
    <div class="docx-container">
      <VueOfficeDocx :src="docxSrc" />
    </div>

    <!-- 右侧区域 -->
    <div class="right-container">
      <!-- 上部分输入区 -->
      <div class="input-container">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>风险类别</th>
                <th>数值</th>
                <th>风险等级</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>需求变更风险</td>
                <td><input v-model.number="highRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(highRisk) }}</td>
              </tr>
              <tr>
                <td>预算超支风险</td>
                <td><input v-model.number="mediumRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(mediumRisk) }}</td>
              </tr>
              <tr>
                <td>人员短缺和技能不匹配风险</td>
                <td><input v-model.number="lowRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(lowRisk) }}</td>
              </tr>
              <tr>
                <td>项目延误风险</td>
                <td><input v-model.number="veryHighRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(veryHighRisk) }}</td>
              </tr>
              <tr>
                <td>软件质量风险</td>
                <td><input v-model.number="veryLowRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(veryLowRisk) }}</td>
              </tr>
              <tr>
                <td>软件进度风险</td>
                <td><input v-model.number="criticalRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(criticalRisk) }}</td>
              </tr>
              <tr>
                <td>项目管理风险</td>
                <td><input v-model.number="negligibleRisk" type="number" min="0" /></td>
                <td>{{ getRiskLevel(negligibleRisk) }}</td>
              </tr>
              <!-- 总体风险等级行，点击按钮后显示 -->
              <tr v-if="showOverallRisk">
                <td><strong>总体风险等级(RSK)</strong></td>
                <td><strong>{{ overallRiskValue }}</strong></td>
                <td><strong>{{ overallRiskLevel }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 计算按钮和下一步按钮 -->
        <div class="button-container">
          <button @click="calculateOverallRisk">计算总体风险等级</button>
          <button @click="nextStep" class="next-button">下一步</button>
        </div>
      </div>

      <!-- 下部分饼图区域 -->
      <div class="chart-container">
        <div id="pie-chart" style="width: 100%; height: 100%;"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 外部容器 */
.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* 左侧文档区域 */
.docx-container {
  flex: 2;
  max-width: 50%;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 右侧区域 */
.right-container {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 垂直居中 */
  align-items: center;      /* 水平居中 */
  padding: 20px;
  border-left: 2px solid #ddd; /* 左边框 */
}

/* 上部分输入区 */
.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;  /* 确保输入区的宽度为100% */
  border-bottom: 2px solid #ddd; /* 添加分割线 */
  padding-bottom: 20px;
}


/* 表格区域 */
.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container th, .table-container td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.table-container th {
  background-color: #f4f4f4;
}

/* 按钮区域 */
.button-container {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.next-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.next-button:hover {
  background-color: #36a872;
}

/* 饼图区域 */
.chart-container {
  flex: 1;
  width: 70%;  /* 设置为右侧容器宽度的 70% */
  height: 400px;  /* 设置饼图的高度 */
  min-height: 300px;
}
</style>
