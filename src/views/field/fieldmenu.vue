<template>
  <div class="page-container">
  <!-- 返回按钮 -->
  <div class="back-container">
      <button class="back-button" @click="goBack">
        &#8592; 返回
      </button>
  </div>
  <div class="container">
    <!-- 文件列表和删除操作 -->
    <div class="file-list">
      <el-table :data="fileList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column prop="filePath" label="文件存储位置"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="deleteFile(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="deleteSelectedFiles">删除选中文件</el-button>
    </div>
    <!-- 文件上传 -->
    <div class="file-upload">
      <div class="upload-section">
        <h3>Word文件上传的注意事项</h3>
        <p>1. 仅支持.docx格式的Word文档，如遇.doc格式的文件，请先在WPS或者Office中将文件另存为（选择格式为.docx）</p>
        <p>2. Word文档需设置文档标题，否则无法解析文档的目录结构</p>
        <p>3. 优先推荐上传Word格式的可研方案、设计方案、建设方案、实施方案，选择方案中系统功能章节进行评估</p>
        <input type="file" @change="handleWordFileUpload" />
        <el-button @click="uploadWordFile">点击上传Word文件</el-button>

      </div>
      <div></div>

      <div class="upload-section">
        <h3>Excel文件上传的注意事项</h3>
        <p>1. 仅支持.xlsx格式的Excel文档，如遇.xls格式的文件，请先在WPS或者Office中将文件另存为（选择格式为.xlsx）</p>
        <p>2. 模板中所有标题含“必填”的列都是必须填的，否则会出现解析失败的问题。</p>
        <p>3. 模板中的“功能描述”列的各行必填项，否则无法解析</p>

        <input type="file" @change="handleExcelFileUpload" />
        <el-button @click="uploadExcelFile">点击上传Excel文件</el-button>
        <el-button @click="downloadExcelTemplate">点我下载Excel格式模板</el-button>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, ref,onMounted } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useRouter } from 'vue-router';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';

export default defineComponent({
  components: {
    ElTable,
    ElTableColumn,
    ElButton
  },
  setup() {
    axios.defaults.baseURL = '/web';
    const selectedWordFile = ref<File | null>(null);
    const selectedExcelFile = ref<File | null>(null);
    const router = useRouter();
    const fileList = ref([]);
    const selectedFiles = ref([]);
    // 从 localStorage 加载项目数据
function loadProjectInfo() {
  const storedProject = localStorage.getItem('savedProject');
  return storedProject ? JSON.parse(storedProject) : null;
}

const projectInfo = loadProjectInfo();

    const handleWordFileUpload = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        selectedWordFile.value = files[0];
      }
    };

    const handleExcelFileUpload = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        selectedExcelFile.value = files[0];
      }
    };

    const uploadWordFile = async () => {
      if (!selectedWordFile.value) {
        alert('Please select a Word file first.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedWordFile.value);
      formData.append('projectId', projectInfo.projectId); // 传递 projectId 参数
      try {
        const response = await axios.post('/api/upload/word', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Word file uploaded successfully:', response.data);
        router.push({
          path: "/FunctionPointEvaluation",
          query: {
            fileId: response.data.id,
          }
        });
        fetchFiles(); // 刷新文件列表
      } catch (error) {
        console.error('Error uploading Word file:', error);
        alert('Failed to upload Word file.');
      }
    };

    const uploadExcelFile = async () => {
      if (!selectedExcelFile.value) {
        alert('Please select an Excel file first.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedExcelFile.value);
      formData.append('projectId', projectInfo.projectId); // 传递 projectId 参数
      try {
        const response = await axios.post('/api/upload/excel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Excel file uploaded successfully:', response.data);
        router.push({
          path: '/FunctionPointEvaluation',
          query: {
            fileId: response.data.id,
          }
        });
        fetchFiles(); // 刷新文件列表
      } catch (error) {
        console.error('Error uploading Excel file:', error);
        alert('Failed to upload Excel file.');
      }
    };

    const downloadExcelTemplate = () => {
      const wb = XLSX.utils.book_new();
      const ws_data = [
        ["序号（选填）", "子系统（必填）", "一级功能点（必填）", "二级功能点（选填）", "三级功能点（选填）", "四级功能点（选填）", "功能描述（必填）"],
        [1, "子系统", "登录", "登录前端页面", "", "", "登录系统"],
        [2, "子系统", "登录", "文字校验码", "", "", "文字校验码"],
        [3, "子系统", "登录", "图片校验码", "", "", "图片校验码"],
        [4, "子系统", "登录", "滑动条校验码", "", "", "滑动条校验码"],
        [5, "子系统", "登录", "登录密码规则校验", "", "", "密码长度、复杂度等密码规则校验、校验码验证"],
        [6, "子系统", "登录", "忘记密码", "", "", "忘记密码、修改密码、校验码验证"],
        [7, "子系统", "登录", "发送短信验证码", "", "", "发送短信验证码"],
        [8, "子系统", "登录", "短信验证码登录", "", "", "短信验证码发送、短信验证码校验"]
      ];
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, '评估模板文件.xlsx');
    };

    const fetchFiles = async () => {
      try {
        const response = await axios.get('/api/files');
        fileList.value = response.data;
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    const handleSelectionChange = (val) => {
      selectedFiles.value = val;
    };

    const deleteFile = async (id) => {
      try {
        await axios.delete(`/api/delete/${id}`);
        fetchFiles(); // 刷新文件列表
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file.');
      }
    };
    // 返回上一页面
    const goBack = () => {
      router.push('/home');  // 使用路径进行跳转
    };

    const deleteSelectedFiles = async () => {
      if (selectedFiles.value.length === 0) {
        alert('Please select at least one file to delete.');
        return;
      }
      for (const file of selectedFiles.value) {
        await deleteFile(file.id);
      }
    };

    onMounted(() => {
      fetchFiles(); // 初始化时获取文件列表
});
   

    return {
      handleWordFileUpload,
      uploadWordFile,
      handleExcelFileUpload,
      uploadExcelFile,
      downloadExcelTemplate,
      fileList,
      handleSelectionChange,
      deleteFile,
      deleteSelectedFiles,
      goBack
    };
  },
});
</script>
<style scoped>
.container {
  display: flex;
}

.file-list {
  flex: 5; /* 占据60% 的宽度 */
  margin-right: 20px;
}

.file-upload {
  flex: 5; /* 占据40% 的宽度 */
}

.upload-section {
  border: 1px solid #dcdfe6;
  padding: 40px;
  margin-bottom: 40px;
  border-radius: 4px;
  background-color: #f9f9f9;
  text-align: left; /* 文字靠左对齐 */
}

.upload-section h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.upload-section p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.custom-file-upload {
  display: flex;
  align-items: center;
}

.custom-file-upload input[type="file"] {
  display: none; /* 隐藏默认的文件输入按钮 */
}

.custom-file-upload .el-button {
  margin-left: 10px; /* 调整自定义按钮的左边距 */
}
.el-button--primary {
  margin: 10px;
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