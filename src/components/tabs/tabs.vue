<template>
  <div class="header-title">
        <span><button class="back-button" >
        &#8592; 
      </button></span>
        <span>项目评估</span>
  </div> 
    <div class="header-container">
      <!-- <div class="header-title">
        <span>项目评估</span>
      </div> -->
      <el-steps
        :active="activeStep"
        align-center
        finish-status="success"
        @change="handleStepChange"
        class="steps-container"
      >
        <!-- 步骤条内容 -->
        <el-step title="GSC权值输入" name="FunctionPointEvaluation"></el-step>
        <el-step title="功能点评估" name="FunctionPointsIdentify"></el-step>
        <el-step title="工作量评估" name="effortAssessmentmenu"></el-step>
        <el-step title="风险评估" name="riskAssessment"></el-step>
        <el-step title="评估结果" name="standards"></el-step>
        <el-step title="功能点审核" name="review"></el-step>
      </el-steps>
      <!-- 弹框 -->
      <el-dialog
        v-model="dialogVisible"
        @opened="handleOpened"
        title="评估报告"
        width="1200px"
        top="5vh"
      >
        <div class="docWrap">
          <div ref="file"></div>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { exportWordImage, getWordImage } from "@/utils/exportFile";
  import axios from "axios";
  axios.defaults.baseURL = "/web";
  
  const router = useRouter();
  const route = useRoute();
  const activeStep = ref(0); // 当前步骤索引
  const stepRoutes = [
    "/FunctionPointEvaluation",
    "/FunctionPointsIdentify",
    "/effortAssessmentmenu",
    "/riskAssessment",
    "/standards",
    "/review",
  ];
  const dialogVisible = ref(false);
  const imgSize = ref({
    imgPath: [150, 150],
    imgPath1: [550, 250],
  });
  const htmlTitle = ref("启动方案");
  const project = ref();
  const projectInfo = loadProjectInfo();
  
  const handleStepChange = (newStep) => {
    activeStep.value = newStep;
    router.push({ path: stepRoutes[newStep] }); // 根据步骤跳转对应路由
  };
  
  watch(
    () => route.path,
    (newPath) => {
      activeStep.value = stepRoutes.findIndex((route) => route === newPath); // 根据路由更新当前步骤
    }
  );
  
  const downLoad = () => {
    exportWordImage(
      "../moban.docx",
      project.value,
      htmlTitle.value,
      imgSize.value
    );
  };
  // 处理时间
  const formatDate = (time) => {
    const date = new Date(time);
    return date.toLocaleString(); // 输出格式类似：2024/4/21 14:20:52
  };
  // 从 localStorage 加载项目数据
  function loadProjectInfo() {
    const storedProject = localStorage.getItem("savedProject");
    return storedProject ? JSON.parse(storedProject) : null;
  }
  onMounted(async () => {
    // 准备请求体
    const requestBody = { projectName: projectInfo.projectName };
    // 发起后端请求
    const response = await axios.post("/project/find", requestBody);
    if (response.data.isOk) {
      console.log(response.data.project);
      project.value = response.data.project;
      project.value.projectTime = formatDate(project.value.projectTime);
    }
  });
  const goPreview = () => {
    dialogVisible.value = true;
  };
  
  const file = ref(null);
  const handleOpened = () => {
    getWordImage("../moban.docx", project.value, imgSize.value, file.value);
  };
  </script>
  
  <style lang="scss" scoped>
  .header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  
    .steps-container {
      width: 100%;
      max-width: 800px;
      
    }
  
    .header-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
  
      .export-button {
        font-size: 14px;
        font-weight: bold;
        color: #606266;
        background-color: #f0f2f5;
        border: 1px solid #dcdfe6;
      }
    }
  }
  .header-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      text-align: left; /* 左对齐 */
    }
  
  .docWrap {
    height: 700px;
    overflow: auto;
    clear: both;
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
  </style>
  