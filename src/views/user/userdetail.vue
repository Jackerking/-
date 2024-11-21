<script setup>
import { exportWordImage, getWordImage } from "@/utils/exportFile";
import { ref,onMounted } from "vue";
import axios from 'axios';
axios.defaults.baseURL = '/web';
const dialogVisible = ref(false);
const imgSize = ref({
  imgPath: [150, 150],
  imgPath1: [550, 250],
});



const htmlTitle = ref("启动方案");
const project=ref()
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
// 从 localStorage 加载项目数据
function loadProjectInfo() {
  const storedProject = localStorage.getItem('savedProject');
  return storedProject ? JSON.parse(storedProject) : null;
}

const projectInfo = loadProjectInfo()
onMounted(async () => {
// 准备请求体
const requestBody = { projectName: projectInfo.projectName };
    // 发起后端请求
    const response = await axios.post('/project/find', requestBody);
    if (response.data.isOk) {
        console.log(response.data.project);
         project.value = response.data.project;
         project.value.projectTime=formatDate(project.value.projectTime);
    }
     
});
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

<template>
  <div style="height: 90%; background: #fff; padding: 24px">
    <div style="margin-bottom: 17px; text-align: left">
      <el-button type="primary" @click="downLoad"> 下载启动方案 </el-button>
      <el-button type="primary" @click="goPreview"> 预览启动方案 </el-button>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    @opened="handleOpened"
    title="流程图"
    width="1200px"
    top="5vh"
  >
    <div class="docWrap">
      <div ref="file"></div>
    </div>
  </el-dialog>
</template>

<style scoped>
.btn {
  float: left;
  margin: 0 0 24px;
}
.docWrap {
  height: 700px;
  overflow: auto;
  clear: both;
}
</style>
