<template>
  <div class="header-title">
        <span><button class="back-button" @click="goBack">
        &#8592; </button></span>
        <span>评估结果</span>
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
        <sapn class="button">
        <el-button type="default" @click="downLoad"> 下载启动方案 </el-button>
        <el-button type="default" @click="goPreview"> 预览启动方案 </el-button>
        </sapn>
      </el-steps>
  </div>
  <div class="container">
    <!-- 信息卡片区域 -->
    <div class="card-container">
      <el-card v-for="(card, index) in infoCards" :key="index" class="info-card">
        <div>
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">{{ card.value }} <span>{{ card.unit }}</span></div>
        </div>
      </el-card>
    </div>

    <!-- 类别统计区域 -->
    <h3 class="section-title">类别统计</h3>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="category" label="功能分类" align="center"></el-table-column>
      <el-table-column prop="amount" label="数量" align="center"></el-table-column>
    </el-table>

    <!-- 柱状图区域 -->
    <div class="chart-container">
      <div id="bar-chart" class="bar-chart"></div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    @opened="handleOpened"
    title="评估结果"
    width="1200px"
    top="5vh"
  >
    <div class="docWrap">
      <div ref="file"></div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { exportWordImage, getWordImage } from "@/utils/exportFile";

axios.defaults.baseURL = '/web';

// 响应式信息卡片数据
const infoCards = reactive([
  { title: '调整前规模', value: 0, unit: '功能点' },
  { title: '调整后规模', value: 0, unit: '功能点' },
  { title: '人月单价', value: 0, unit: '人月' },
  { title: '调整后工作量', value: 0, unit: '人月' },
  { title: '软件开发费用', value: 0, unit: '元' },
  { title: '功能点单价', value: 0, unit: '元' },
]);
const project=ref()
// 表格的数据
const tableData = ref([
  { category: 'EO', amount: 0 },
  { category: 'EI', amount: 0 },
  { category: 'EQ', amount: 0 },
  { category: 'ILF', amount: 0 },
  { category: 'EIF', amount: 0 },
]);
const activeStep = ref(5); // 当前步骤索引
const router = useRouter();
// 返回上一页面
const goBack = () => {
      router.push('/riskAssessment');  // 使用路径进行跳转
};
// 从 localStorage 加载项目数据
function loadProjectInfo() {
  const storedProject = localStorage.getItem('savedProject');
  return storedProject ? JSON.parse(storedProject) : null;
}

const projectInfo = loadProjectInfo();

// 初始化柱状图
onMounted(async () => {
  const chartDom = document.getElementById('bar-chart');
  const myChart = echarts.init(chartDom);

  try {
    // 准备请求体
    const requestBody = { projectName: projectInfo.projectName };

    // 发起后端请求
    const response = await axios.post('/project/find', requestBody);

    if (response.data.isOk) {
       project.value = response.data.project;
       project.value.projectTime=formatDate(project.value.projectTime);
           console.log(project)
      // 动态更新信息卡片的数据
      infoCards[0].value = project.value.unadjustedFunctionPoints.toFixed(2) || 0; // 调整前规模
      infoCards[1].value = project.value.adjustedFunctionPoints.toFixed(2) || 0;   // 调整后规模
      infoCards[2].value = project.value.personnelCosts || 0;           // 人月单价
      infoCards[3].value = project.value.ae || 0; // 调整后工作量 (假设比例)
      infoCards[4].value = (project.value.totalCost).toFixed(2) || 0;                // 软件开发费用
      infoCards[5].value = (project.value.totalCost/project.value.adjustedFunctionPoints).toFixed(2) || 0; // 功能点单价

      // 动态更新表格数据
      tableData.value = [
        { category: 'EO', amount: project.value.eo || 0 },
        { category: 'EI', amount: project.value.ei || 0 },
        { category: 'EQ', amount: project.value.eq || 0 },
        { category: 'ILF', amount: project.value.ilf || 0 },
        { category: 'EIF', amount: project.value.eif || 0 },
      ];

      // 更新柱状图
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: tableData.value.map((item) => item.category),
          axisLabel: { fontSize: 16 },
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontSize: 16 },
        },
        series: [
          {
            data: tableData.value.map((item) => item.amount),
            type: 'bar',
            itemStyle: { color: '#409eff' },
            label: { show: true, position: 'top', fontSize: 16 },
          },
        ],
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
      });
    } else {
      ElMessage.error('获取项目数据失败');
    }
  } catch (error) {
    ElMessage.error('获取项目数据失败');
  }
});

const dialogVisible = ref(false);
const imgSize = ref({
  imgPath: [150, 150],
  imgPath1: [550, 250],
});

const htmlTitle = ref("启动方案");
const downLoad = () => {
  exportWordImage(
    "../moban.docx",
    project.value,
    htmlTitle.value,
    imgSize.value
  );
};
 //处理时间
 const formatDate = (time) => {
    const date = new Date(time);
    return date.toLocaleString(); // 输出格式类似：2024/4/21 14:20:52
  };
const goPreview = () => {
  dialogVisible.value = true;
};

const file = ref(null);
const handleOpened = () => {
  getWordImage(
    "../moban.docx",
    project.value ,
    imgSize.value,
    file.value
  );
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.card-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  flex: 1;
  text-align: center;
  padding: 20px;
}

.card-title {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
}

.card-value span {
  font-size: 14px;
  color: #909399;
  margin-left: 5px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 30px 0 10px;
}

.chart-container {
  margin-top: 30px;
}

.bar-chart {
  width: 100%;
  height: 400px;
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
.button {
  display: block; /* 确保 span 作为块级元素 */
  text-align: right; /* 右对齐 */
}
</style>
