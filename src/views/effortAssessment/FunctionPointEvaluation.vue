<template>
    <div class="header-title">
        <span><button class="back-button" @click="goBack">
        &#8592; </button></span>
        <span>GSC权重输入</span>
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
                <el-card class="box-card">
                    <!-- 使用el-row和el-col布局将表单分为三列 -->
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <!-- 第一列：权重输入 -->
                            <el-form :model="fp" label-width="120px" label-position="left">
                                <el-form-item label="ILF">
                                    <el-input v-model="fp.ilfWeight" />
                                </el-form-item>
                                <el-form-item label="EIF">
                                    <el-input v-model="fp.eifWeight" />
                                </el-form-item>
                                <el-form-item label="EI">
                                    <el-input v-model="fp.eiWeight" />
                                </el-form-item>
                                <el-form-item label="EO">
                                    <el-input v-model="fp.eoWeight" />
                                </el-form-item>
                                <el-form-item label="EQ">
                                    <el-input v-model="fp.eqWeight" />
                                </el-form-item>
                                <el-form-item label="规模因子调整">
                                    <el-select v-model="scaleChangeFactor" placeholder="请选择">
                                        <el-option label="估算早期(如概算、预算阶段)，参数为1.39" value="估算早期" />
                                        <el-option label="结算中期（如投标、项目计划阶段)，参数为1.21" value="估算中期" />
                                        <el-option label="估算晚期(如需求分析阶段)，参数为1.10" value="估算晚期" />
                                        <el-option label="项目交付后及运维阶段，参数为1.00" value="项目交付后及运维阶段" />
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        
                        <el-col :span="8">
                            <!-- 第二列：通用系统因子（第一组） -->
                            <el-form :model="gp" label-width="120px" label-position="left">
                                <el-form-item label="数据通信">
                                    <el-input v-model="gp.communication" />
                                </el-form-item>
                                <el-form-item label="在线升级">
                                    <el-input v-model="gp.onlineUpgrade" />
                                </el-form-item>
                                <el-form-item label="分布式处理">
                                    <el-input v-model="gp.distributedProcessing" />
                                </el-form-item>
                                <el-form-item label="复杂处理度">
                                    <el-input v-model="gp.complexity" />
                                </el-form-item>
                                <el-form-item label="性能">
                                    <el-input v-model="gp.performance" />
                                </el-form-item>
                                <el-form-item label="可复用性">
                                    <el-input v-model="gp.reusability" />
                                </el-form-item>
                                <el-form-item label="高使用强度配置">
                                    <el-input v-model="gp.configuration" />
                                </el-form-item>
                            </el-form>
                        </el-col>
                        
                        <el-col :span="8">
                            <!-- 第三列：通用系统因子（第二组） -->
                            <el-form :model="gp" label-width="120px" label-position="left">
                                
                                <el-form-item label="易安装性">
                                    <el-input v-model="gp.easeOfInstallation" />
                                </el-form-item>
                                <el-form-item label="事务频度">
                                    <el-input v-model="gp.transactionFrequency" />
                                </el-form-item>
                                <el-form-item label="易操作性">
                                    <el-input v-model="gp.easeOfOperation" />
                                </el-form-item>
                                <el-form-item label="在线数据输入">
                                    <el-input v-model="gp.onlineDataEntry" />
                                </el-form-item>
                                <el-form-item label="跨平台性">
                                    <el-input v-model="gp.crossPlatform" />
                                </el-form-item>
                                <el-form-item label="用户使用利率">
                                    <el-input v-model="gp.EndUserUsageRate" />
                                </el-form-item>
                                <el-form-item label="灵活性">
                                    <el-input v-model="gp.flexibility" />
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>

                    <div class="form-bottom-button">
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import axios from 'axios';
import {
    ElMessage
} from 'element-plus';
import { useRouter } from 'vue-router';
import { Edit } from '@element-plus/icons-vue'

//步骤条当前位置
const currentStep = ref(0);
axios.defaults.baseURL = '/web';

//路由
const router = useRouter();

const ufcSource = ref(0);
const usSource = ref(0);

// 跳转下一个一页面
const goBack = () => {
      router.push('/fieldmenu');  // 使用路径进行跳转
    };
//权重输入
const fp = ref({
    ilfWeight: "",
    eiWeight: "",
    eoWeight: "",
    eqWeight: "",
    eifWeight: ""
});
const activeStep = ref(0); // 当前步骤索引
//通用系统因子输入
const gp = ref({
    communication: '',
    onlineUpgrade: '',
    distributedProcessing: '',
    complexity: '',
    performance: '',
    reusability: '',
    configuration: '',
    easeOfInstallation: '',
    transactionFrequency: '',
    easeOfOperation: '',
    onlineDataEntry: '',
    crossPlatform: '',
    EndUserUsageRate: '',
    flexibility: ''
})

//规模因子调整
const scaleChangeFactor = ref("");
const project=ref();

const inputFactor = () => {
    // let fd = new FormData();
    // fd.append('ILF', fp.value.ILF);
    // fd.append('EIF', fp.value.EIF);
    // fd.append('EI', fp.value.EI);
    // fd.append('EO', fp.value.EO);
    // fd.append('EQ', fp.value.EQ);
    // axios.post('http://localhost:8080/fc/addweight', fd).then(res => {
    //     if (res.data.isOk) {
    //         ElMessage.success('添加成功');
    //         router.push('/inputFactor');
    //     }
    // }).catch(error => {
    //     ElMessage.error('Error updating user: ' + error.message);
    // });
    const formData = new FormData();
    formData.append('fp', JSON.stringify(fp.value)); // fp 是前端表单中的 Functionalpoint 对象
    formData.append('gp', JSON.stringify(gp.value)); // gp 是前端表单中的 GscPt 对象
    formData.append('scaleChangeFactor1', scaleChangeFactor.value); // scaleChangeFactor 是一个数值
    formData.append('filePath', project.value.filePath); 
    formData.append('projectId', project.value.projectId);
    localStorage.setItem('fp', JSON.stringify(fp.value));
    localStorage.setItem('gp', JSON.stringify(gp.value));
    localStorage.setItem('scaleChangeFactor1', JSON.stringify(scaleChangeFactor.value));
    axios.post('http://localhost:9000/fc/addweight', formData)
        .then((res) => {
            if (res.data.isok) {
                ElMessage.success("资讯创建成功");
                ufcSource.value = res.data.totalUnadjusted;
                console.log(ufcSource.value);
                
                usSource.value = res.data.totalAdjusted;
                const EIFCount = res.data.EIFCount;
                const ILFCount = res.data.ILFCount;
                const EICount = res.data.EICount;
                const EOCount = res.data.EOCount;
                const EQCount = res.data.EQCount;
                localStorage.setItem('EIFCount', JSON.stringify(EIFCount));
                localStorage.setItem('ILFCount', JSON.stringify(ILFCount));
                localStorage.setItem('EICount', JSON.stringify(EICount));
                localStorage.setItem('EOCount', JSON.stringify(EOCount));
                localStorage.setItem('EQCount', JSON.stringify(EQCount));
                localStorage.setItem('ufcSource', JSON.stringify(ufcSource.value));
                localStorage.setItem('usSource', JSON.stringify(usSource.value));

                router.push('/FunctionPointsIdentify');
            } else {
                ElMessage.error("资讯创建失败");
            }
        })
        .catch((err) => {
            ElMessage.error('创建失败: ' + err);
        });
};

// 从 localStorage 加载项目数据
function loadProjectInfo() {
  const storedProject = localStorage.getItem('savedProject');
  return storedProject ? JSON.parse(storedProject) : null;
}

const projectInfo = loadProjectInfo()
const onSubmit = () => {
        inputFactor();

}
onMounted(async () => {
// 准备请求体
const requestBody = { projectName: projectInfo.projectName };
    // 发起后端请求
    const response = await axios.post('/project/find', requestBody);
    if (response.data.isOk) {
        console.log(response.data.project);
         project.value = response.data.project;
    }
     
});

</script>

<style scoped>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.box-card {
    width: auto;
    height: 650px;
}

.el-step {
    cursor: pointer;
}

.form-bottom-button {
    display: flex;
    justify-content: center;
}

.el-form {
    padding: 20px;
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