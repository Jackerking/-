<template>
    <div class="common-layout">
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="24">
              <el-input v-model="searchKeyword" placeholder="请输入功能点描述进行搜索" clearable @clear="loadMenus" />
              <el-button type="primary" @click="searchFC">搜索</el-button>
              <el-button type="warning" @click="resetList">重置列表</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-select v-model="selectedCategory" placeholder="请选择功能点类型进行筛选" @change="filterByCategory">
                <el-option label="EQ" value="EQ"></el-option>
                <el-option label="EIF" value="EIF"></el-option>
                <el-option label="ILF" value="ILF"></el-option>
                <el-option label="EI" value="EI"></el-option>
                <el-option label="EO" value="EO"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-card style="width: 400px" shadow="hover">
                <el-statistic title="调整前的规模" :value="ufcOutputValue" :value-style="{ fontSize: '30px' }" suffix="功能点" />
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card style="width: 400px" shadow="hover">
                <el-statistic title="调整后的规模" :value="usOutputValue" :value-style="{ fontSize: '30px' }" suffix="功能点" />
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData" :header-cell-style="{ background: 'black', color: 'white' }" stripe style="width: 100%; height: 500px">
                <el-table-column prop="triggeringSentence" label="功能点描述" width="870" header-align="center"/>
                <el-table-column prop="category" label="功能类型" width="100" align="center" />
                <el-table-column prop="unadjustedFunctionPoints" label="UFP" width="100" align="center" />
                <el-table-column prop="reuseLevel" label="重用程度" width="100" align="center" />
                <el-table-column prop="modificationType" label="修改类型" width="100" align="center" />
                <el-table-column prop="adjustedFunctionPoints" label="US" width="100" align="center" />
                <el-table-column label="操作" width="180" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" @click="editFC(row)">修改</el-button>
                    <el-button type="danger" @click="delFC(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form ref="addForm" :model="addForm" label-width="120px">
                <el-form-item label="功能点类型">
                  <el-select v-model="addForm.category" placeholder="请选择功能点类型">
                    <el-option label="EQ" value="EQ"></el-option>
                    <el-option label="EIF" value="EIF"></el-option>
                    <el-option label="ILF" value="ILF"></el-option>
                    <el-option label="EI" value="EI"></el-option>
                    <el-option label="EO" value="EO"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="未调整功能点">
                  <el-input v-model="addForm.unadjustedFunctionPoints"></el-input>
                </el-form-item>
                <!-- 其他字段 -->
                <el-form-item>
                  <el-button type="primary" @click="addFC">添加功能点</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form ref="editForm" :model="editForm" label-width="120px" v-if="editForm.id">
                <el-form-item label="功能点类型">
                  <el-select v-model="editForm.category" placeholder="请选择功能点类型">
                    <el-option label="EQ" value="EQ"></el-option>
                    <el-option label="EIF" value="EIF"></el-option>
                    <el-option label="ILF" value="ILF"></el-option>
                    <el-option label="EI" value="EI"></el-option>
                    <el-option label="EO" value="EO"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="未调整功能点">
                  <el-input v-model="editForm.unadjustedFunctionPoints"></el-input>
                </el-form-item>
                <!-- 其他字段 -->
                <el-form-item>
                  <el-button type="primary" @click="updateFC">更新功能点</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import axios from 'axios';
  import { ElTable, ElTableColumn, ElMessage, ElSelect, ElOption, ElForm, ElFormItem, ElButton } from 'element-plus';
import router from '../router';
  
  axios.defaults.withCredentials = true;
  
  const ufcSource = ref(JSON.parse(localStorage.getItem('ufcSource') || '{}'));
  const ufcOutputValue = ref(ufcSource.value);
  const usSource = ref(JSON.parse(localStorage.getItem('usSource') || '{}'));
  const usOutputValue = ref(usSource.value);
  
  const tableData = ref([
    {
      triggeringSentence: '',
      category: '',
      unadjustedFunctionPoints: '',
      reuseLevel: '',
      modificationType: '',
      adjustedFunctionPoints: ''
    }
  ]);
  
  const searchKeyword = ref(''); // 搜索关键词
  const selectedCategory = ref(null); // 选中的功能点类型
  
  const addForm = reactive({
    category: '',
    unadjustedFunctionPoints: '',
    reuseLevel: '',
    modificationType: '',
    triggeringSentence: '',
    adjustedFunctionPoints: ''
    // 其他字段
  });
  
  const editForm = reactive({
    id: 0,
    category: '',
    unadjustedFunctionPoints: '',
    reuseLevel: '',
    modificationType: '',
    adjustedFunctionPoints: ''
    // 其他字段
  });
  
  const loadMenus = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/fc/list`);
      if (res.data.isok) {
        ElMessage.success("加载数据成功");
        tableData.value = res.data.fc;
      } else {
        ElMessage.error(res.data.msg);
      }
    } catch (error) {
      console.error("加载动态失败:", error);
      ElMessage.error("加载动态失败，请稍后重试");
    }
  };
  
  const searchFC = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/fc/search`, {
        params: {
          keyword: searchKeyword.value
        }
      });
      if (res.data && res.data.length > 0) {
        ElMessage.success("搜索成功");
        tableData.value = res.data;
      } else {
        ElMessage.info("没有找到匹配的功能点");
        tableData.value = [];
      }
    } catch (error) {
      console.error("搜索失败:", error);
      ElMessage.error("搜索失败，请稍后重试");
    }
  };
  
  const resetList = async () => {
    searchKeyword.value = ''; // 清空搜索关键词
    loadMenus(); // 重新加载完整的列表数据
  };
  
  const filterByCategory = async () => {
    if (selectedCategory.value) {
      try {
        const res = await axios.get(`http://localhost:8080/fc/filter`, {
          params: {
            cg: selectedCategory.value
          }
        });
        if (res.data) {
          ElMessage.success("筛选成功");
          tableData.value = res.data;
        } else {
          ElMessage.info("没有找到匹配的功能点");
          tableData.value = [];
        }
      } catch (error) {
        console.error("筛选失败:", error);
        ElMessage.error("筛选失败，请稍后重试");
      }
    } else {
      ElMessage.warning("请选择一个功能点类型");
    }
  };
  
  const addFC = async () => {
  try {
    const res = await axios.post('http://localhost:8080/fc/add', {
      category: addForm.category,
      unadjustedFunctionPoints: addForm.unadjustedFunctionPoints,
      reuseLevel: addForm.reuseLevel,
      modificationType: addForm.modificationType,
      triggeringSentence: addForm.triggeringSentence,
      adjustedFunctionPoints: addForm.adjustedFunctionPoints,
      // 其他字段根据实际情况添加
    });
    if (res.data.isok) {
      ElMessage.success("添加成功");
      loadMenus(); // 重新加载列表
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("添加失败:", error);
    ElMessage.error("添加失败，请稍后重试");
  }
};

const delFC = async (id: any) => {
  try {
    const fc = new FormData();
    fc.append('id', id);
    fc.append('totalUnadjusted',ufcSource.value);
    fc.append('totalAdjusted',usSource.value);

    const res = await axios.post('http://localhost:8080/fc/del', fc);
    if (res.data.isok) {
      ElMessage.success("删除成功");
      ufcSource.value = res.data.totalUnadjusted;
      console.log(ufcSource.value);
                
      usSource.value = res.data.totalAdjusted;
      localStorage.setItem('ufcSource', JSON.stringify(ufcSource.value));
      localStorage.setItem('usSource', JSON.stringify(usSource.value));
      loadMenus(); // 重新加载列表
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败，请稍后重试");
  }
};

const editFC = (row:any) => {
  editForm.id = row.id;
  editForm.category = row.category;
  editForm.unadjustedFunctionPoints = row.unadjustedFunctionPoints;
  editForm.reuseLevel = row.reuseLevel;
  editForm.modificationType = row.modificationType;
  editForm.adjustedFunctionPoints = row.adjustedFunctionPoints;
  // 其他字段根据实际情况添加
};

const updateFC = async () => {
  try {
    const res = await axios.post('http://localhost:8080/fc/update', {
      id: editForm.id,
      category: editForm.category,
      unadjustedFunctionPoints: editForm.unadjustedFunctionPoints,
      reuseLevel: editForm.reuseLevel,
      modificationType: editForm.modificationType,
      adjustedFunctionPoints: editForm.adjustedFunctionPoints,
      // 其他字段根据实际情况添加
    });
    if (res.data.isok) {
      ElMessage.success("修改成功");
      loadMenus(); // 重新加载列表
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("修改失败:", error);
    ElMessage.error("修改失败，请稍后重试");
  }
};

onMounted(() => {
  loadMenus();
});
</script>
<style scoped> 
    .el-row { margin-bottom: 20px; } 
    .el-row:last-child { margin-bottom: 0; } 
    .el-col { border-radius: 4px; } 
</style>