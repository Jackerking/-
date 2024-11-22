<template>
  <div class="header-title">
        <span><button class="back-button" @click="goBack">
        &#8592; </button></span>
        <span>功能点评估</span>
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

  <div class="common-layout">
    <el-container>
      <el-main>
        <div>
          <el-row :gutter="40">
            <el-col :span="9">
              <!-- 功能点数值 -->
              <el-card style="width: 100%; border-radius: 15px">
                <el-card shadow="hover">
                  <el-statistic title="调整前的规模" :value="ufcOutputValue" :value-style="{ fontSize: '30px' }"
                    suffix="功能点" />
                </el-card>
                <el-card style="margin-top: 5%" shadow="hover">
                  <el-statistic title="调整后的规模" :value="usOutputValue" :value-style="{ fontSize: '30px' }"
                    suffix="功能点" />
                </el-card>
              </el-card>
            </el-col>
            <el-col :span="15">
              <el-card style="width: 100%; height: 100%; border-radius: 15px">
                <div ref="echart" class="echart" style="width: 100%; height: 248px"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- 功能点明细 -->
        <div class="list">
          <el-card style="width: 100%; border-radius: 15px">
            <!-- 搜索过滤 -->
            <el-row gutter="20">
              <el-col :span="10">
                <el-input v-model="searchKeyword" placeholder="请输入功能点描述进行搜索" clearable @clear="loadMenus" />
              </el-col>
              <el-col :span="3">
                <el-select v-model="selectedCategory" placeholder="请选择功能点类型进行筛选" @change="filterByCategory">
                  <el-option label="EQ" value="EQ"></el-option>
                  <el-option label="EIF" value="EIF"></el-option>
                  <el-option label="ILF" value="ILF"></el-option>
                  <el-option label="EI" value="EI"></el-option>
                  <el-option label="EO" value="EO"></el-option>
                </el-select>
              </el-col>
              <el-col :span="1.5">
                <el-button type="primary" :icon="Search" @click="searchFC">搜索</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="warning" :icon="Close" @click="resetList">重置</el-button>
              </el-col>
              <!-- 添加功能点 -->
              <el-col :span="1.5">
                <el-button type="success" size="small" :icon="Plus" @click="showAddDialog">添加</el-button>
              </el-col>
              <!-- 添加功能点 -->
              <el-col :span="1.5">
                <el-button type="success" size="small" :icon="Plus" @click="go">下一步</el-button>
              </el-col>
            </el-row>
            <!-- 功能点明细列表 -->
            <el-table :data="tableData" :header-cell-style="{ background: 'black', color: 'white' }" stripe
              style="width: 100%; height: 300px; margin-top: 10px">
              <!-- <el-table-column prop="id" label="ID" width="150" align="center" /> -->
              <el-table-column prop="triggeringSentence" label="功能点描述" width="600" header-align="center" />
              <el-table-column prop="category" label="功能类型" align="center" />
              <el-table-column prop="unadjustedFunctionPoints" label="UFP" width="100" align="center" />
              <el-table-column prop="reuseLevel" label="重用程度" align="center" />
              <el-table-column prop="modificationType" label="修改类型" align="center" />
              <el-table-column prop="adjustedFunctionPoints" label="US" align="center" />
              <el-table-column fixed="right" label="操作" min-width="120" align="center">
                <template #default="{ row }">
                  <el-button type="primary" @click="editfc2(row.id)">修改</el-button>
                  <el-button type="danger" @click="delFC(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
  <!-- 新增功能点表单对话框 -->
  <el-dialog title="添加功能点" v-model="addDialogVisible" width="30%">
    <el-form :model="addForm">
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
      <el-form-item label="重用程度">
        <el-select v-model="addForm.reuseLevel" placeholder="请选择重用程度">
          <el-option label="低" value="低"></el-option>
          <el-option label="中" value="中"></el-option>
          <el-option label="高" value="高"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修改类型">
        <el-select v-model="addForm.modificationType" placeholder="请选择修改类型">
          <el-option label="新增" value="新增"></el-option>
          <el-option label="修改" value="修改"></el-option>
          <el-option label="删除" value="删除"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能点描述">
        <el-input v-model="addForm.triggeringSentence"></el-input>
      </el-form-item>
      <!-- 其他字段 -->
      <el-form-item>
        <el-button type="primary" @click="addFC">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 修改功能点表单对话框 -->
  <el-dialog title="修改功能点" v-model="editDialogVisible" width="30%">
    <el-form :model="editForm">
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
      <el-form-item label="重用程度">
        <el-select v-model="editForm.reuseLevel" placeholder="请选择重用程度">
          <el-option label="低" value="低"></el-option>
          <el-option label="中" value="中"></el-option>
          <el-option label="高" value="高"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修改类型">
        <el-select v-model="editForm.modificationType" placeholder="请选择修改类型">
          <el-option label="新增" value="新增"></el-option>
          <el-option label="修改" value="修改"></el-option>
          <el-option label="删除" value="删除"></el-option>
        </el-select>
      </el-form-item>
      <!-- 其他字段 -->
      <el-form-item>
        <el-button type="primary" @click="editFC">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useTransition } from '@vueuse/core'
import axios from 'axios';
import {
  ElTable,
  ElTableColumn,
  ElMessage
} from 'element-plus';
import { Close, Plus, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import { nextTick } from 'vue';
axios.defaults.withCredentials = true;
import { useRouter, useRoute } from 'vue-router';

//数据显示
//调整前功能点数量
const ufcSource = ref(JSON.parse(localStorage.getItem('ufcSource') || '{}'));
const ufcOutputValue = useTransition(ufcSource, {
  duration: 1500,
})
// 返回上一页面
const goBack = () => {
      router.push('/FunctionPointEvaluation');  // 使用路径进行跳转
};
//调整后功能点数量
const usSource = ref(JSON.parse(localStorage.getItem('usSource') || '{}'));
const usOutputValue = useTransition(usSource, {
  duration: 1500,
})

//权重输入
const fp = ref(JSON.parse(localStorage.getItem('fp') || '{}'));

//通用系统因子输入
const gp = ref(JSON.parse(localStorage.getItem('gp') || '{}'));

//规模因子调整
const scaleChangeFactor = ref(JSON.parse(localStorage.getItem('scaleChangeFactor') || '{}'));
const EIFCount = ref(JSON.parse(localStorage.getItem('EIFCount') || '{}'));
const ILFCount = ref(JSON.parse(localStorage.getItem('ILFCount') || '{}'));
const EICount = ref(JSON.parse(localStorage.getItem('EICount') || '{}'));
const EOCount = ref(JSON.parse(localStorage.getItem('EOCount') || '{}'));
const EQCount = ref(JSON.parse(localStorage.getItem('EQCount') || '{}'));
console.log(EICount.value);

//表格
const tableData = ref([
  {
    triggeringSentence: '',
    category: '',
    unadjustedFunctionPoints: '',
    reuseLevel: '',
    modificationType: '',
    adjustedFunctionPoints: ''
  }
])


//数据加载
const loadMenus = async () => {
  try {
    const res = await axios.get(`http://localhost:9000/fc/list`);
    if (res.data.isok) {
      ElMessage.success("加载数据成功");
      tableData.value = res.data.fc;
      // ufcSource.value = ;
      // usSource.value = ;
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("加载动态失败:", error);
    ElMessage.error("加载动态失败，请稍后重试");
  }
};

const chartInstance = ref<ECharts | null>(null);

  const router = useRouter();
// 跳转下一个一页面
const go = () => {
      router.push('/effortAssessmentmenu');  // 使用路径进行跳转
    };
// 初始化图表
const initChart = () => {
  if (chartInstance.value && chartInstance.value.dispose) {
    chartInstance.value.dispose();
  }
  const echartEl = document.querySelector('.echart') as HTMLElement;
  if (echartEl) {
    chartInstance.value = echarts.init(echartEl);
    const options = {
      title: {
        text: '功能点数量统计'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['EIF', 'ILF', 'EI', 'EO', 'EQ']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [EIFCount.value, ILFCount.value, EICount.value, EOCount.value, EQCount.value],
        type: 'bar',
        name: '数量'
      }]
    };
    chartInstance.value.setOption(options);
  }
};
//添加功能点
//添加所需定义
const addForm = reactive({
  category: '',
  unadjustedFunctionPoints: '',
  reuseLevel: '',
  modificationType: '',
  triggeringSentence: '',
  // 其他字段
});

//打开添加表单
const addDialogVisible = ref(false);

const activeStep = ref(1); // 当前步骤索引

const showAddDialog = () => {
  addDialogVisible.value = true;
};

//确认添加
const addFC = async () => {
  try {
    const fc = new FormData();
    fc.append('category', addForm.category);
    fc.append('unadjustedFunctionPoints', addForm.unadjustedFunctionPoints);
    fc.append('reuseLevel', addForm.reuseLevel);
    fc.append('modificationType', addForm.modificationType);
    fc.append('triggeringSentence', addForm.triggeringSentence);
    fc.append('fp', JSON.stringify(fp.value)); // fp 是前端表单中的 Functionalpoint 对象
    fc.append('gp', JSON.stringify(gp.value)); // gp 是前端表单中的 GscPt 对象
    fc.append('scaleChangeFactor1', scaleChangeFactor.value); // scaleChangeFactor 是一个数值
    fc.append('totalUnadjusted', ufcSource.value);
    fc.append('totalAdjusted', usSource.value);

    const res = await axios.post('http://localhost:9000/fc/add', fc);
    if (res.data.isok) {
      ufcSource.value = res.data.totalUnadjusted;
      console.log(ufcSource.value);
                
      usSource.value = res.data.totalAdjusted;
      localStorage.setItem('ufcSource', JSON.stringify(ufcSource.value));
      localStorage.setItem('usSource', JSON.stringify(usSource.value));
      ElMessage.success("添加成功");
      location.reload();
      loadMenus(); // 重新加载列表
      addDialogVisible.value = false;
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("添加失败:", error);
    ElMessage.error("添加失败，请稍后重试");
  }
};

//修改功能点
//修改所需定义
const editForm = reactive({
  category: '',
  unadjustedFunctionPoints: '',
  reuseLevel: '',
  modificationType: '',
  // 其他字段
});

//打开修改表单
const editDialogVisible = ref(false);

const showEditDialog = () => {
  editDialogVisible.value = true;
};

const editfc2 = async (id: any) => {
  showEditDialog();
  localStorage.setItem('id', id);

}

//确认修改
const editFC = async () => {
  try {
    const id = ref(JSON.parse(localStorage.getItem('id') || '{}'));
    const fc = new FormData();
    fc.append('id', id.value);
    fc.append('category', editForm.category);
    fc.append('unadjustedFunctionPoints', editForm.unadjustedFunctionPoints);
    fc.append('reuseLevel', editForm.reuseLevel);
    fc.append('modificationType', editForm.modificationType);
    fc.append('fp', JSON.stringify(fp.value)); // fp 是前端表单中的 Functionalpoint 对象
    fc.append('gp', JSON.stringify(gp.value)); // gp 是前端表单中的 GscPt 对象
    fc.append('scaleChangeFactor1', scaleChangeFactor.value); // scaleChangeFactor 是一个数值
    fc.append('totalUnadjusted', ufcSource.value);
    fc.append('totalAdjusted', usSource.value);
    const res = await axios.post('http://localhost:9000/fc/update', fc);
    if (res.data.isok) {
      ufcSource.value = res.data.totalUnadjusted;
      console.log(ufcSource.value);
                
      usSource.value = res.data.totalAdjusted;
      localStorage.setItem('ufcSource', JSON.stringify(ufcSource.value));
      localStorage.setItem('usSource', JSON.stringify(usSource.value));
      ElMessage.success("修改成功");
      location.reload();
      loadMenus(); // 重新加载列表
      editDialogVisible.value = false;
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("修改失败:", error);
    ElMessage.error("修改失败，请稍后重试");
  }
};

//删除功能点
const delFC = async (id: any) => {
  try {
    const fc = new FormData();

    fc.append('id', id);
    fc.append('totalUnadjusted',ufcSource.value);
    fc.append('totalAdjusted',usSource.value);
    fc.append('fp', JSON.stringify(fp.value)); // fp 是前端表单中的 Functionalpoint 对象
    fc.append('gp', JSON.stringify(gp.value)); // gp 是前端表单中的 GscPt 对象
    fc.append('scaleChangeFactor1', scaleChangeFactor.value); // scaleChangeFactor 是一个数值

    const res = await axios.post('http://localhost:9000/fc/del', fc);
    if (res.data.isok) {
      ElMessage.success("删除成功");
      ufcSource.value = res.data.totalUnadjusted;
      console.log(ufcSource.value);
                
      usSource.value = res.data.totalAdjusted;
      localStorage.setItem('ufcSource', JSON.stringify(ufcSource.value));
      localStorage.setItem('usSource', JSON.stringify(usSource.value));
      location.reload(); 
      loadMenus(); // 重新加载列表
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败，请稍后重试");
  }
};

//搜索过滤
const searchKeyword = ref(''); // 搜索关键词
const selectedCategory = ref(); // 选中的功能点类型

const searchFC = async () => {
  try {
    const res = await axios.get(`http://localhost:9000/fc/search`, {
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
      const res = await axios.get(`http://localhost:9000/fc/filter`, {
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

//钩子函数
onMounted(() => {
  //加载列表
  loadMenus();
  nextTick(() => {
    initChart();
  });
});
</script>

<style scoped>
.list {
  margin-top: 10px;
}

.add {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.echart {
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
</style>
