<template>
   <div class="page-container">
  <!-- 返回按钮 -->
  <div class="back-container">
      <button class="back-button" @click="goBack">
        &#8592; 返回
      </button>
    </div>
  <div class="container">
    <!-- 左边展示文件内容 -->
    <div class="file-content">
      <VueOfficeDocx v-if="docxSrc && fileExtension === 'docx'" :src="docxSrc" style="width: 100%; height: auto;" />
      <VueOfficeExcel v-else-if="excelSrc && fileExtension === 'xlsx'" :src="excelSrc" style="width: 100%; height: 500px;" />
    </div>

    <!-- 右边建立可编辑的表格 -->
    <div class="table-content">
      <!-- 新增功能点按钮 -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
        <button style="margin-right: 10px;" @click="returnfile" class="blue-button">重新上传</button>
      <button @click="addTableRow" class="blue-button"> + 新增功能点</button>
      <button @click="tiaozhuan" class="blue-button"> 跳转</button>
</div>
      <table>
        <thead>
          <tr>
            <th>功能点计数项名称</th>
            <th>重用程度</th>
            <th>修改类型</th>
            <th>功能类型</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableRows" :key="index">
            <td><input type="text" v-model="row.name" /></td>
            <td>
              <select v-model="row.reuseLevel">
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </td>
            <td>
              <select v-model="row.modifyType">
                <option value="修改">修改</option>
                <option value="新增">新增</option>
              </select>
            </td>
            <td>
              <select v-model="row.functionType">
                <option value="EI">EI</option>
                <option value="EI">EO</option>

                <option value="EI">EQ</option>
                <option value="EI">ILF</option>
                <option value="EI">EIF</option>

                
              </select>
            </td>
            <td><input type="text" v-model="row.notes" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
   </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import "@vue-office/docx/lib/index.css";
import "@vue-office/excel/lib/index.css";
import { useRoute ,useRouter } from 'vue-router';
import axios from 'axios';
import { ro } from "element-plus/es/locale/index.mjs";

axios.defaults.baseURL = '/web';
const route = useRoute();
const router = useRouter();
const fileId = route.query.fileId;
let docxSrc = ref("");
let excelSrc = ref("");
let fileExtension = ref("");

// 表格行数据
const tableRows = ref([
  { name: '', reuseLevel: '高', modifyType: '修改', functionType: 'EI', notes: '' }
]);

// 添加表格行的方法
function addTableRow() {
  tableRows.value.push({ name: '', reuseLevel: '高', modifyType: '修改', functionType: 'EI', notes: '' });
}
function returnfile() {
   router.back();
}
const tiaozhuan=()=>{
  router.push('/FunctionPointEvaluation');
}
// 返回上一页面
const goBack = () => {
      router.push('/fieldmenu');  // 使用路径进行跳转
    };

async function getFileUrl(fileId) {
  try {
    const response = await axios.get(`/api/view/download/url/${fileId}`);
    if (response.data) {
      const fullFilePath = response.data;
      const prefix = "E:\\qianduanzuixin\\ProductConsrtuct_frontend\\public";
      if (fullFilePath && fullFilePath.startsWith(prefix)) {
        const relativePath = fullFilePath.replace(prefix, '');
        const extension = relativePath.split('.').pop().toLowerCase();
        fileExtension.value = extension;
        if (extension === 'docx') {
          docxSrc.value = relativePath;
        } else if (extension === 'xlsx') {
          excelSrc.value = relativePath;
        }
      }
    } else {
      console.error("Failed to get file URL from the server.");
    }
  } catch (error) {
    console.error("Error fetching file URL:", error);
  }
}

onMounted(() => {
  getFileUrl(fileId);
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh; /* 使容器高度占满整个视口高度 */
}

.file-content, .table-content {
  overflow: auto; /* 允许内容溢出并显示滚动条 */
}

.file-content {
  flex: 3; /* 占据3份空间 */
  max-width: 45%; /* 最大宽度为37.5%，确保总宽度不超过100% */
}

.table-content {
  flex: 5; /* 占据5份空间 */
  max-width: 55%; /* 最大宽度为62.5%，确保总宽度不超过100% */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

input, select {
  width: 100%;
  padding: 5px;
  margin: 2px 0;
  box-sizing: border-box;
}

button {
  margin-bottom: 40px;
}
.blue-button {
  background-color: rgb(103, 103, 240); /* 设置按钮背景颜色为蓝色 */
  color: white; /* 设置按钮文字颜色为白色 */
  border: none; /* 去除按钮边框 */
  padding: 10px 10px; /* 设置按钮内边距 */
  margin: 10px 0; /* 设置按钮外边距 */
  cursor: pointer; /* 设置鼠标悬停时的指针样式 */
}

.blue-button:hover {
  background-color: rgb(6, 6, 240); /* 设置鼠标悬停时按钮的背景颜色 */
}
/* 返回按钮样式 */
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start; /* 左对齐 */
  background: none;
  border: none;
  color: #409eff;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 5px 10px;
  font-weight: bold;
}
/* 返回按钮容器样式 */
.back-container {
  display: flex;
  justify-content: flex-start; /* 左对齐 */
  padding: 10px;
  margin-bottom: 20px;
}
/* 整体页面容器样式 */
.page-container {
  display: flex;
  flex-direction: column;
}
</style>