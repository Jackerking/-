<template>
  <Tabs></Tabs>
    <div class="cost-standard-page">
      <!-- 顶部搜索区域 -->
      <el-container>
        <el-header>
          <el-row type="flex" justify="space-between" align="middle">
            <!-- 名称输入框 -->
            <el-col :span="10">
              <el-input 
                v-model="nameQuery" 
                placeholder="请输入标准名称..." 
                prefix-icon="el-icon-search"
                class="search-input"
              />
            </el-col>
  
            <!-- 状态下拉框 -->
            <el-col :span="10">
              <el-select 
                v-model="statusQuery" 
                placeholder="请选择状态" 
                class="search-input"
                :style="{ width: '20%' }"
              >
                <el-option label="全部" value="" />
                <el-option label="启用" value="enabled" />
                <el-option label="禁用" value="disabled" />
              </el-select>
            </el-col>
  
            <!-- 搜索和重置按钮 -->
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <el-button type="primary" @click="searchStandards" class="action-button" icon="Search">
                  搜索
                </el-button>
                <el-button type="default" @click="resetSearch" class="action-button" icon="RefreshRight">
                  重置
                </el-button>
              </el-row>
            </el-col>

          </el-row>
          <hr class="divider" />
        </el-header>
  
        <!-- 展示造价标准 -->
        <el-row :gutter="20">
          <!-- 新增造价标准的卡片 -->
          <el-col :span="8">
            <el-card class="add-card" @click="openAddForm">
              <div class="add-card-content">
                <el-button type="dashed" block icon="el-icon-plus">
                  新增造价标准
                </el-button>
              </div>
            </el-card>
          </el-col>
  
          <!-- 展示现有的造价标准卡片 -->

           <el-col 
  v-for="standard in paginatedStandards" 
  :key="standard.stdId" 
  :span="8" 
  v-if="filteredStandards.length > 0"
>
  <el-card class="standard-card">
    <div class="card-header">
      <!-- 根据标准类型设置不同字体颜色 -->
      <span :class="{'official-type': standard.type === 'official', 'custom-type': standard.type === 'history'}">
        {{ standard.type === 'official' ? '官方' : '自定义' }}
      </span>

      <!-- 启用/禁用按钮，根据状态修改颜色 -->
      <el-button 
        size="small" 
        :type="standard.enable === 'enabled' ? 'success' : 'danger'" 
        @click="toggleStatus(standard)"
        :icon="standard.enable === 'enabled' ? 'Check' : 'Close'"
        circle
      >
      </el-button>
    </div>


    <div class="card-body">
      <div class="card-content">
        <!-- 标题优化 -->
        <h3 class="card-title">{{ standard.stdName }}</h3>
        <!-- 描述优化 -->
        <p class="card-description">{{ standard.intro }}</p>
      </div>

      <!-- 按钮组居中显示 -->
      <div class="button-group">
        <!-- 如果是历史标准，显示修改参数和删除按钮 -->
        <el-button 
          v-if="standard.type === 'history'" 
          size="small" 
          type="info" 
          class="view-button" 
          @click="viewParameters(standard)"
          icon="Edit"
        >
          查看参数
        </el-button>

        <el-button 
          v-if="standard.type === 'history'" 
          size="small" 
          type="danger" 
          @click="deleteStandard(standard)" 
          class="delete-button"
          aria-label="删除标准"
          title="删除标准"
          icon="Delete"
        >
          删除
        </el-button>

        <!-- 如果是官方标准，显示查看参数按钮 -->
        <el-button 
          v-else 
          size="small" 
          type="info" 
          class="view-button" 
          @click="viewParameters(standard)"
          icon="Document"
        >
          查看参数
        </el-button>
      </div>
    </div>
  </el-card>
</el-col>


        </el-row>
  
   <!-- 固定在左下角的分页器 -->
   <el-pagination
          class="pagination"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="filteredStandards.length"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </el-container>
  
      <!-- 新增造价标准表单弹窗 -->
      <el-dialog v-model="formVisible" title="新增造价标准" width="30%" append-to-body>
        <el-form :model="formData" @submit.prevent="submitForm">
          <!-- 标准名称 -->
          <el-form-item label="标准名称" :rules="[{ required: true, message: '请输入标准名称' }]">
            <el-input v-model="formData.stdName" />
          </el-form-item>
  
          <!-- 参考造价标准下拉框
          <el-form-item label="参考造价标准" :rules="[{ required: true, message: '请选择参考造价标准' }]">
            <el-select v-model="referenceId" placeholder="请选择参考造价标准">
              <el-option v-for="standard in standards" :key="standard.stdId" :label="standard.stdName" :value="standard.stdId" />
            </el-select>
          </el-form-item> -->
  
  
          <!-- 描述 -->
          <el-form-item label="描述" :rules="[{ required: true, message: '请输入标准描述' }]">
            <el-input v-model="formData.intro" />
          </el-form-item>
  
          <!-- PDR -->
          <el-form-item label="PDR" :rules="[{ required: true, message: '请输入PDR' }]">
            <el-input v-model="formData.pdr" />
          </el-form-item>
  
          <slot name="footer">
            <div slot="footer" class="dialog-footer" style="display: flex; justify-content: space-between; align-items: center;">
              <!-- 左侧的“取消”按钮 -->
              <el-button @click="closeForm" type="default">取消</el-button>
              
              <!-- 右侧的“确定”按钮 -->
              <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
          </slot>
  
        </el-form>
      </el-dialog>
  
  
  <!-- 查看参数的对话框 -->
  <!-- 查看参数的对话框 -->
  <el-dialog v-model="viewDialogVisible" title="查看参数" width="30%" append-to-body>
    <div v-for="(factorsList, type) in formattedFactors" :key="type" style="margin-bottom: 20px;">
      <!-- 使用 el-row 和 el-col 来创建行和列布局 -->
      <el-row :gutter="20" align="middle">
        <!-- 类型和参数数值列 -->
        <el-col :span="6" style="text-align: right;">
          <span style="font-weight: bold;">
            {{ type }}: 
            <!-- 显示已选的数值 -->
            {{ selectedValues[type] }}
          </span>
        </el-col>
  
        <!-- 下拉框列，单选 -->
        <el-col :span="12">
          <el-select v-model="selectedValues[type]" placeholder="请选择" filter style="width: 100%;">
            <el-option
              v-for="factor in factorsList"
              :key="factor.factor_name"
              :label="factor.factor_name"
              :value="factor.factor_value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
  
    <!-- 对话框底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="viewDialogVisible = false">返回</el-button>
    </div>
  </el-dialog>
  
  
     <!-- 修改标准对话框 -->
     <el-dialog
  title="修改标准"
  v-model="ChangeDialogVisible"
  width="30%"
  append-to-body
  @close="resetForm"
>
  <!-- 修改标准表单 -->
  <el-form
    ref="editForm"
    label-width="120px"
  >
    <!-- 标准名称 -->
    <el-form-item
      label="标准名称"
      :rules="[{ required: true, message: '请输入标准名称', trigger: 'blur' }]"
    >
      <el-input
        v-model ="editForm.stdName"  
        placeholder="请输入标准名称"
      />
    </el-form-item>

    <!-- 描述 -->
    <el-form-item
      label="描述"
      :rules="[{ required: true, message: '请输入标准描述', trigger: 'blur' }]"
    >
      <el-input
        type="textarea"
        v-model.lazy="editForm.intro"  
        placeholder="请输入标准描述"
        rows="3"
      />
    </el-form-item>
  </el-form>

  <!-- 对话框底部按钮 -->
  <div slot="footer" class="dialog-footer">
    <!-- 左侧的“取消”按钮 -->
    <el-button @click="closeDialog" type="default">取消</el-button>
    
    <!-- 右侧的“确定”按钮 -->
    <el-button type="primary" @click="submitEdit">确定</el-button>
  </div>
</el-dialog>


  
    </div>
  </template>
  
  
    
  
    
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { ElInput, ElButton, ElRow, ElCol, ElCard, ElForm, ElFormItem, ElSelect, ElOption, ElDialog } from 'element-plus';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import axios from 'axios';
  import Tabs from '@/components/tabs/resourcetabs.vue';
  import { Search, RefreshRight } from "@element-plus/icons-vue";
  
  // 造价标准数据类型
  interface CostStandard {
    stdId: number;
    stdName: string;
    pdr: number;
    createTime: string;
    intro: string;
    type: 'history' | 'official';  // 枚举类型
    enable: 'enabled' | 'disabled';  // 枚举类型
  }
  // 定义类型
  interface Factor {
    factor_type: string;
    factor_name: string;
    factor_value: number | string;
  }
  const viewDialogVisible = ref(false); // 控制查看参数对话框的显示
  const ChangeDialogVisible = ref(false);// 控制修改对话框的显示
  const factors = ref<Factor[]>([]); // 存储参数数据
  // 固定展示的类型
  const predefinedTypes = ['AT', 'BD', 'DT', 'QR', 'SL', 'SF'];
  
  // 修改 formattedFactors 的声明，明确它是一个以 string 为键，Factor[] 为值的对象
  const formattedFactors = ref<Record<string, Factor[]>>({});
  // 初始化 selectedValues 和 formattedFactors
  
  // 用于存储每个类型的选中值
  const selectedValues = ref<Record<string, (string | number)[]>>({});
  // 获取选中值的标签（即因子的名称）
  const getFactorLabel = (type: string, value: string | number) => {
    const factorsList = formattedFactors.value[type] || [];
    // 显式声明 f 的类型为 Factor
    const factor = factorsList.find((f: Factor) => f.factor_value === value);
    return factor ? factor.factor_name : '';
  };
  
  //修改规则
  const rules = {
        stdName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        intro: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
      };
  // 当前选中的标准
  const editForm = {               
        stdName:  '' ,
        intro: ''
      };
  // 定义 props 的类型
  const props = defineProps<{
    standard: CostStandard;
  }>();
  //赋值用的标准
  const editstandard = ref<CostStandard>({
    stdId: 0,  // 新增时没有ID
    stdName: '',
    pdr: 0.0,
    createTime: '',
    intro: '',
    type: 'history',  // 默认选择为历史类型
    enable: 'enabled'  // 默认启用
  });
  
  
  // 造价标准列表
  const standards = ref<CostStandard[]>([]);
  // 是否点击了搜索
  
  // 定义表单数据
  const formData = ref<CostStandard>({
    stdId: 0,  // 新增时没有ID
    stdName: '',
    pdr: 0.0,
    createTime: '',
    intro: '',
    type: 'history',  // 默认选择为历史类型
    enable: 'enabled'  // 默认启用
  });
  
  // 参考造价标准
  const referenceId: number = 1;
  const pageIndex = ref(1);
  const pageSize = ref(8); // 每页显示 6 条
  // 计算分页后的标准列表
  const paginatedStandards = computed(() => {
    const start = (pageIndex.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredStandards.value.slice(start, end);
  });
  
  // 分页页码变化时的处理函数
  const handlePageChange = (newPage: number) => {
    pageIndex.value = newPage;
  };
  
  // 获取造价标准列表
  const fetchStandards = async () => {
    try {
      const response = await axios.get('http://localhost:9000/CostStandard/list');
      if (response.data.isOk) {
        standards.value = response.data.CostStandards;
      } else {
        ElMessage.error('获取数据失败');
      }
    } catch (error) {
      ElMessage.error('网络请求失败');
    }
  };
  
  // 启用/禁用状态切换
  const toggleStatus = async (standard: CostStandard) => {
    try {
      // 切换状态
      const newStatus = standard.enable === 'enabled' ? 'disabled' : 'enabled';
  
      // 直接保留 stdId，并发送包含 stdId 和更新后的状态
      const response = await axios.post('http://localhost:9000/CostStandard/update', {
        stdId: standard.stdId,  // 保留 stdId 以便后端根据 stdId 更新
        enable: newStatus        // 更新 enable 状态
      });
  
      if (response.data.isOk) {
        // 更新本地状态
        standard.enable = newStatus;
        ElMessage.success('状态更新成功');
      } else {
        ElMessage.error('状态更新失败');
      }
    } catch (error) {
      ElMessage.error('网络请求失败');
    }
  };
  
  
  // 在组件挂载时加载标准列表
  onMounted(() => {
    fetchStandards();
  });
  
  // 搜索框绑定的变量
  const nameQuery = ref('');
  const statusQuery = ref('');
  
  // 控制表单显示
  const formVisible = ref(false);
  
  // 当前显示的标准
  const filteredStandards = computed(() => {
    return standards.value.filter(standard => {
      console.log('Checking standard:', standard); // 打印每个标准的数据
  
      // 根据需要过滤标准，可以按名称和启用状态来过滤
      const matchesName = standard.stdName.toLowerCase().includes(nameQuery.value.toLowerCase());
      const matchesStatus = statusQuery.value ? standard.enable === statusQuery.value : true;
  
      // 返回符合条件的标准
      return matchesName && matchesStatus;
    });
  });
  
  
  // 打开新增表单
  const openAddForm = () => {
    formData.value = {
      stdId: 0,        // 新增时没有ID
      stdName: '',
      pdr: 0,
      createTime: '',
      intro: '',
      type: 'history',  // 默认选择为历史类型
      enable: 'enabled'  // 默认启用
    };
    formVisible.value = true;
  };
  
  // 提交表单（新增或编辑）
  const submitForm = async () => {
    try {
      if (formData.value.stdId === 0) {
        // 新增操作
        // 删除 stdId，确保不传递给后端
        const { stdId, ...formDataWithoutId } = formData.value;
          // 确保 PDR 是数字类型
        console.log(formDataWithoutId)
        const response = await axios.post('http://localhost:9000/CostStandard/add', formDataWithoutId);
        const result = response.data;
        console.log(response.data);
        if (result.isOk) {
          standards.value.push({ ...formData.value });  // 更新前端列表
          closeForm();
          ElMessage.success('添加成功');
        } else {
          ElMessage.error('添加失败: ' + result.msg);
        }
      } else {
        // 编辑操作
        const index = standards.value.findIndex(standard => standard.stdId === formData.value.stdId);
        if (index !== -1) {
          standards.value[index] = { ...formData.value };
          closeForm();
          ElMessage.success('更新成功');
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
      ElMessage.error('提交失败，请稍后再试');
    }
  };
  
  // 提交修改
  const submitEdit = async () => {
    editstandard.value.stdName = editForm.stdName;
    editstandard.value.intro = editForm.intro;
    console.log(editstandard.value.intro +","+editstandard.value.stdName);
    const response = await axios.post('http://localhost:9000/CostStandard/updateui', editstandard);
        const result = response.data;
        console.log(response.data);
        if (result.isOk) {
           // 更新前端列表中的元素
            const updatedStandard = editstandard.value;  // 获取更新后的标准数据
            const index = standards.value.findIndex(standard => standard.stdId === updatedStandard.stdId);  // 假设每个标准有唯一的 id
            if (index !== -1) {
              // 更新标准列表中对应元素的值
              standards.value[index] = { ...standards.value[index], ...updatedStandard };
            }

      // 关闭表单
          closeForm();
          ElMessage.success('修改成功');
        } else {
          ElMessage.error('修改失败: ' + result.msg);
        }

};
  
  // 关闭表单
  const closeForm = () => {
    formVisible.value = false;
  };
  // 重置表单
  const resetForm = () => {
      
  };
  
  //关闭修改对话框
  const closeDialog = () => {
    ChangeDialogVisible.value = false;
    resetForm();
  }
  
  
  // 搜索标准
  const searchStandards = () => {
    console.log('搜索条件:', nameQuery.value, statusQuery.value);
    console.log(filteredStandards.value)
  };
  
  
  
  // 重置搜索
  const resetSearch = () => {
    nameQuery.value = '';
    statusQuery.value = '';
  };
  

  // 修改参数
  const editParameters = (standard: CostStandard) => {
    editstandard.value = { ...editstandard.value, ...standard }; // 保留原有结构并覆盖相应字段
    ChangeDialogVisible.value = true;
    // 这里你可以打开一个编辑参数的表单或弹窗
  };
  
  //查看参数
  // 获取因子数据并处理
  const viewParameters = async (standard: { stdId: number }) => {
    const { stdId } = standard;
    try {
      const results: Factor[] = [];
      const selectedValuesTemp: Record<string, (string | number)[]> = {};
  
      // 遍历固定类型数组，逐一请求后端
      for (const factorType of predefinedTypes) {
        const response = await axios.get('http://localhost:9000/Factor/find', { params: { factor_type: factorType, stdId } });
  
        if (response.data.isOk) {
          const factorsList = response.data.Factors;
  
          if (factorsList.length > 0) {
            results.push(...factorsList.map((factor: Factor) => ({
              factor_type: factor.factor_type,
              factor_name: factor.factor_name,
              factor_value: factor.factor_value,
            })));
            // 初始化 selectedValues 为第一个因子的值
            selectedValuesTemp[factorType] = [factorsList[0].factor_value];
          } else {
            results.push({ factor_type: factorType, factor_name: '无数据', factor_value: '-' });
            selectedValuesTemp[factorType] = ['-'];
          }
        } else {
          console.error(`查询失败: ${response.data.msg} (类型: ${factorType})`);
        }
      }
  
      // 将整理后的数据赋值给 formattedFactors 和 selectedValues
      formattedFactors.value = results.reduce((acc, factor) => {
        if (!acc[factor.factor_type]) {
          acc[factor.factor_type] = [];
        }
        acc[factor.factor_type].push(factor);
        return acc;
      }, {} as Record<string, Factor[]>);
  
      selectedValues.value = selectedValuesTemp;
  
      // 显示查看参数的对话框
      viewDialogVisible.value = true;
    } catch (error) {
      console.error('请求错误:', error);
    }
  };
  
  
  
  
  // 删除标准
  const deleteStandard = async (standard: CostStandard) => {
  try {
    // 使用 ElMessageBox 弹出确认框
    await ElMessageBox.confirm(
      `确认删除标准：${standard.stdName} 吗？`, // 弹窗提示文本
      '提示', // 弹窗标题
      {
        confirmButtonText: '确定', // 确认按钮文本
        cancelButtonText: '取消', // 取消按钮文本
        type: 'warning', // 弹窗类型
      }
    );

    // 如果用户点击“确定”，执行删除操作
    const response = await axios.request({
      method: 'post',
      url: 'http://localhost:9000/CostStandard/delete',
      data: standard, // 将标准对象作为请求体传递
    });

    if (response.data.isOk) {
      // 删除关联的 Factor 数据
      const response2 = await axios.request({
        method: 'post',
        url: 'http://localhost:9000/Factor/delete',
        headers: {
          'Content-Type': 'application/json', // 明确指定内容类型
        },
        data: standard.stdId, // 传递标准 ID
      });

      if (response2.data.isOk) {
        // 前端更新标准列表
        const index = standards.value.findIndex(item => item.stdId === standard.stdId);
        if (index !== -1) {
          standards.value.splice(index, 1); // 删除标准
          ElMessage.success('删除成功');
        }
      } else {
        ElMessage.error('删除失败: ' + response2.data.msg);
      }
    } else {
      ElMessage.error('删除失败: ' + response.data.msg);
    }
  } catch (error) {
    // 区分用户取消和其他错误
    if (error === 'cancel') {
      // ElMessage.info('已取消删除操作'); // 用户取消操作
    } else {
      console.error('删除失败:', error);
      ElMessage.error('删除失败，请稍后再试'); // 真正的异常处理
    }
  }
};

  </script>
  
    
  
  
  <style scoped lang="scss">
  .cost-standard-page {
    padding: 20px;
  
    .divider {
      margin-top: 20px;
      margin-bottom: 40px;
    }
  
    /* 新增卡片的样式 */
    .add-card {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 190px;
      cursor: pointer;
      border: dashed 2px #409eff;
      margin-bottom: 20px;
    }
  
    .add-card-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  

    .status {
      color: #409eff;
      font-size: 14px;
    }
 
    .card-content {
      text-align: center;
    }
  
    .card-content h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }
  
    .card-content p {
      font-size: 14px;
      margin-bottom: 20px;
    }
  
    .el-dialog {
    background-color: rgba(0, 0, 0, 0.1); /* 设置背景颜色 */
  }
  
  .dialog-footer {
    background-color: red; /* 临时设置footer背景颜色来查看 */
  }
  
    /* 查看参数按钮 */
    .view-button {
      margin-top: auto;
    }
  
    /* 搜索框和按钮样式 */
    .search-input {
    margin-right: 15px; /* 为输入框之间添加间距 */
    width: 100%; /* 设置宽度为100% */
  }
  
    .action-button {
      margin-left: 10px; /* 为按钮添加左边距 */
    }
  }
  /* 按钮组居中 */
.button-group {
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 8px; /* 按钮间隔 */
  margin-top: 10px;
}

/* 按钮样式优化 */
.view-button, .delete-button {
  border-radius: 6px;
}

  
  /* 鼠标悬浮时，改变文字颜色 */
  .delete-button:hover {
    color: #d9534f; /* 鼠标悬停时改变颜色 */
  }
  
  /* 官方类型的字体颜色 */
  .official-type {
    color: red;  /* 红色字体 */
  }
  
  /* 自定义类型的字体颜色 */
  .custom-type {
    color: blue;  /* 蓝色字体 */
  }
  
  /* 你也可以根据需求调整按钮颜色 */
  .el-button.success {
    background-color: green;
    border-color: green;
  }
  
  .el-button.danger {
    background-color: red;
    border-color: red;
  }
  
  /* 定义分页器固定位置的样式 */
  .pagination {
    position: fixed;
    bottom: 20px;  /* 离页面底部20px */
    z-index: 1000; /* 确保在页面上层显示 */
  }

  .custom-divider {
  margin: 10px 0; /* 设置上下间距 */
  border: none; /* 移除默认边框 */
  border-top: 1px solid #409EFF; /* 蓝色边框 */
}

/* 卡片整体样式 */
.standard-card {
  border: 1px solid #FFEB3B; 
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.standard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

/* 分隔线 */
.divider {
  height: 1px;
  background-color: #dcdfe6;
  margin: 8px 0;
}

/* 标题 */
.card-title {
  font-size: 1.2em;
  color: #303133;
  margin-bottom: 6px;
}

/* 描述 */
.card-description {
  font-size: 0.9em;
  color: #606266;
  line-height: 1.5;
}

/* 类型标签样式 */
.official-type {
  color: #409EFF;
}

.custom-type {
  color: #E6A23C;
}


  
  </style>
  