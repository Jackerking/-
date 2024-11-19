<template>
    <div class="project-evaluation">
      <el-row :gutter="20" class="filters">
        <el-col :span="6">
          <el-input v-model="searchName" placeholder="请输入项目名称" clearable />
        </el-col>
        <el-col :span="6">
          <el-select v-model="filters.status" placeholder="状态" clearable>
            <el-option label="全部" value="all"></el-option>
            <el-option label="评估完成" value="completed"></el-option>
            <el-option label="待上传" value="in_progress"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="searchProjects">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
        <el-col :span="6" class="create-button">
          <el-button type="success" @click="openCreateDialog">新增项目</el-button>
        </el-col>
      </el-row>
  
      <el-row :gutter="20" class="project-cards">
      <!-- 遍历 filteredProjects 渲染每个项目的卡片 -->
      <el-col :span="8" v-for="(project, index) in filteredProjects1" :key="index">
        <el-card shadow="hover" class="project-card">
          <template v-slot:header>
            <span>{{ project.projectName }}</span>
          </template>
          <div class="card-content">
            <!-- 调整内容为垂直对齐，左对齐 -->
            <p class="info-row">
              <span class="label">评估金额：</span>
              <template v-if="project.totalCost === 0">
      <span class="value gray-bar"></span> <!-- 灰色条 -->
    </template>
    <template v-else>
      <span class="value">{{ project.totalCost }} 万元</span> <!-- 正常金额显示 -->
    </template>
            </p>
             <!-- 上传状态 -->
             <p class="info-row1">
              
              <span class="status-icon">
                <i
                  :class="project.totalCost ? 'success' : 'pending'"
                  class="status-dot"
                ></i>
                {{ project.totalCost ? '评估完成' : '待上传' }}
              </span>
            </p>
            <p class="info-row">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDate(project.projectTime) || 'N/A' }}</span>
            </p>
            <p class="info-row">
              <span class="label">备注信息：</span>
              <span class="value">{{ project.remark || "无" }}</span>
            </p>
          </div>
          <div class="card-footer">
            <!-- 根据 totalCost 显示不同的操作按钮 -->
            <template v-if="project.totalCost === 0">
              <el-button
                type="text"
                size="small"
                class="footer-button"
                @click="uploadFile(project.projectName)"
              >
                上传文件
              </el-button>
              <el-button
                type="text"
                size="small"
                class="footer-button"
                @click="confirmDelete(project.projectName)"
              >
                删除
              </el-button>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                class="footer-button"
                @click="viewDetails(project.projectName)"
              >
                详情
              </el-button>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
  
      <el-pagination
        v-model:current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="filteredProjects.length"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 30, 50]"
      />
  
      <!-- 新增项目对话框 -->
      <el-dialog v-model="dialogVisible" title="新增项目" width="600px">
        <div class="dialog-header">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="本地项目" name="local"></el-tab-pane>
            <el-tab-pane label="导入项目" name="import"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="dialog-content">
          <el-form :model="newProject" :rules="rules" ref="projectForm">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="newProject.projectName" placeholder="请输入项目名称" />
            </el-form-item>
       <!-- 项目需求 -->
      <el-form-item label="项目需求" prop="requirement">
        <el-input v-model="newProject.requirement" placeholder="请输入项目需求" />
      </el-form-item>
  
      <!-- 开始时间 -->
      <el-form-item label="开始时间" prop="projectTime">
        <el-date-picker
          v-model="newProject.projectTime"
          type="datetime"
          placeholder="请选择开始时间"
        />
      </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed,onMounted,watch } from "vue";
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  axios.defaults.baseURL = '/web';
  // 控制路由
const router = useRouter();
  // 筛选条件
  const filters = ref({
    status: "all", // 筛选状态，默认 "全部"
  });
  const searchName = ref(""); // 输入的项目名称
  
  
  // 项目数据
  const projects = ref([]); // 存储从后端获取的项目数据
  const allProjects = ref([]); // 声明为 ref
  //处理时间
  const formatDate = (time) => {
    const date = new Date(time);
    return date.toLocaleString(); // 输出格式类似：2024/4/21 14:20:52
  };
  const userId=ref(1)
  // 加载项目的函数
  const loadProjects = async (userId) => {
    try {
      const response = await axios.get(`/project/projects?userId=${userId.value}`);
      if (response.data && Array.isArray(response.data)) {
        projects.value = response.data; // 设置项目数据
        console.log(projects.value); // 打印项目数据
      } else {
        ElMessage.error("加载项目失败");
      }
    } catch (error) {
      ElMessage.error("加载项目失败");
      console.error(error); // 打印错误信息
    }
  };
  // 页面挂载时发送请求获取项目数据
  onMounted(async () => {
     
     loadProjects(userId);
  });
  
  // 上传文件操作
  const uploadFile = (projectName) => {
    router.push('/fieldmenu');  // 使用路径进行跳转
  };
  
  
  // 删除项目操作
  const confirmDelete = (projectName) => {
    ElMessageBox.confirm(
      `确定要删除项目 "${projectName}" 吗？`,
      "提示",
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        deleteProject(projectName); // 调用删除操作
      })
      .catch(() => {
        ElMessage.info("取消删除");
      });
  };
  const deleteProject = async (projectName) => {
    try {
      // 调用后端接口
      const response = await axios.delete(`/project/delete`, {
        params: { projectName },
      });
  
      if (response.data === "项目删除成功") {
        ElMessage.success(`项目 "${projectName}" 删除成功`);
        loadProjects(userId);
      } else {
        ElMessage.error(`项目 "${projectName}" 删除失败`);
      }
    } catch (error) {
      ElMessage.error("删除项目失败，请稍后重试");
      console.error(error);
    }
  };
  
  
  // 查看详情操作
  const viewDetails = (projectName) => {
    ElMessage.info(`查看项目详情: ${projectName}`);
  };
  // 分页数据
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
  });
  // 应用筛选条件
  const applyFilters = (projects) => {
    if (filters.value.status === "all") {
      filteredProjects.value = projects; // 不筛选，直接赋值
    } else if (filters.value.status === "completed") {
      filteredProjects.value = projects.filter((project) => project.totalCost !== 0);
    } else if (filters.value.status === "in_progress") {
      filteredProjects.value = projects.filter((project) => project.totalCost === 0);
    }
  };
  
  // 监听状态筛选变化
  watch(
    () => filters.value.status,
    () => {
      applyFilters(allProjects.value); // 基于所有项目重新筛选
    }
  );
  

  
  
  
  // 筛选后的项目
  const filteredProjects1 = computed(() => {
    console.log('projects:', projects.value); // 打印项目数据
    if (Array.isArray(projects.value)) {
      return projects.value.slice(
        (pagination.currentPage - 1) * pagination.pageSize,
        pagination.currentPage * pagination.pageSize
      );
    } else {
      console.error('projects is not an array:', projects.value);
      return [];
    }
  });
  const filteredProjects = ref([]); // 筛选后的项目列表
  
  // 表单相关
  const dialogVisible = ref(false);
  const activeTab = ref("local");
  // 定义随机数生成函数
  const generateRandomId = () => Math.floor(Math.random() * 10) + 1;
  const newProject = ref({
    projectName: "",
    requirement:"",
    projectTime:"",
    id:generateRandomId()
  });
  //保存的项目
  const savedProject = ref({
    projectId:"",                   // 主键
  projectName:"",                // 项目名称
  stdId:"",                       // 标准ID
  AE: "",                          // AE
  RSK: "",                         // RSK
  id:"",                          // 项目ID
  unadjustedFunctionPoints:"",    // 未调整的功能点
  adjustedFunctionPoints:"",      // 调整后的功能点
  personnelCosts: "",              // 人员成本
  filePath:"",                   // 文件路径
  totalCost:"",                   // 总成本
  projectTime:"",        // 项目时间
  userId:"",                      // 用户ID
  EO:"",                          // EO
  EI:"",                          // EI
  EQ:"",                          // EQ
  ILF:"",                         // ILF
  EIF:""                          // EIF
  });
  
  const projectForm = ref(null);
  const rules = {
    projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  requirement: [{ required: true, message: "请输入项目需求", trigger: "blur" }],
  projectTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  };
  
  // 搜索项目
  const searchProjects = async () => {
    try {
      const response = await axios.get("/project/search", {
        params: { projectName: searchName.value }, // 将输入的项目名称作为参数传递
      });
      if (response.data && Array.isArray(response.data)) {
        allProjects.value = response.data; // 设置搜索结果
        applyFilters(allProjects.value); // 应用筛选条件
        projects.value=filteredProjects.value
        console.log(filteredProjects.value); // 打印筛选结果
        ElMessage.success("搜索成功！");
      } else {
        ElMessage.error("没有找到匹配的项目");
      }
    } catch (error) {
      ElMessage.error("搜索失败，请稍后重试");
      console.error(error); // 打印错误日志
    }
  };
  const resetFilters = () => {
    filters.name = "";
    filters.status = "all";
    pagination.currentPage = 1;
  };
  const handlePageChange = (page) => {
    pagination.currentPage = page;
  };
  const openCreateDialog = () => {
    dialogVisible.value = true;
  };
  const resetForm = () => {
    newProject.value.projectName="",
    newProject.value.requirement="",
    newProject.value.projectTime="",
    newProject.value.userId=0
  };
  // 重置搜索
  const resetSearch = () => {
    searchName.value = ""; // 清空搜索框
    filters.value.status = "all"; // 重置筛选条件
    filteredProjects.value = allProjects.value; // 重置筛选结果
    loadProjects(userId);
  
  };
  const submitForm = async () => {
    projectForm.value.validate(async (valid) => {
      if (valid) {
        newProject.value.userId=1
        try {
          const response = await axios.post('/project/create', newProject.value);
          if (response.data.isOk) {
            ElMessage.success('创建项目成功'),
           // 解析并保存返回的 savedProject
           savedProject.value = response.data.project;
           // 将 savedProject 保存在 LocalStorage 中
          localStorage.setItem('savedProject', JSON.stringify(savedProject.value));
           console.log(savedProject.value)
           resetForm();
           // 清空本地存储中的 riskData
          localStorage.removeItem('riskData'); // 清空 riskData
            dialogVisible.value = false,
            loadProjects(userId);
          } else {
            ElMessage.error('创建项目失败')
          }
        } catch (error) {
          ElMessage.error('创建项目失败')
        }
      } else {
        console.log('表单验证失败')
      }
    })
  };
  
  </script>
  
  <style scoped>
  .project-evaluation {
    padding: 20px;
  }
  .gray-bar {
    display: inline-block;
    width: 80px; /* 灰色条的宽度 */
    height: 16px; /* 灰色条的高度 */
    background-color: #e0e0e0; /* 灰色背景 */
    border-radius: 4px; /* 圆角效果 */
  }
  .filters {
    margin-bottom: 20px;
  }
  
  .create-button {
    text-align: right;
  }
  
  .project-cards {
    margin-bottom: 20px;
  }
  
  .project-card {
    margin-bottom: 20px;
  }
  
  .card-content {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    padding: 10px 0; /* 内边距 */
  }
  
  .info-row {
    display: flex;
    align-items: center;
  }
  
  .info-row1 {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* 右对齐 */
  }
  
  .label {
    font-weight: bold;
    color: #606266; /* 深灰色 */
    width: 100px; /* 固定宽度，保证左对齐整齐 */
  }
  
  .value {
    color: #333; /* 默认文本颜色 */
  }
  
  .card-footer {
    text-align: right; /* 将按钮组对齐到右侧 */
  }
  
  .footer-button {
    color: #409eff; /* 蓝色按钮文本 */
    font-weight: bold;
    margin-left: 10px; /* 按钮之间的间距 */
  }
  
  .amount {
    font-weight: bold;
    color: #409eff;
  }
  
  .dialog-footer {
    text-align: right;
  }
  
  .details-button {
    color: #409eff; /* 确保按钮为蓝色 */
    font-weight: bold;
  }
  
  /* 上传状态圆点样式 */
  .status-icon {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .success {
    background-color: #67c23a; /* 绿色 */
  }
  
  .pending {
    background-color: #909399; /* 灰色 */
  }
  </style>
  