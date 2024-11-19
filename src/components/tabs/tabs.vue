<template>
    <div class="header-container">
        <div class="header-title">
            <span>项目评估</span>
        </div>
        <el-tabs
            v-model="activeTab"
            type="card"
            class="demo-tabs"
            tab-position="bottom"
            @tab-click="clickBtn"
        >
            <!-- 固定选项卡内容 -->
            <el-tab-pane label="功能点评估" name="FunctionPointEvaluation"></el-tab-pane>
            <el-tab-pane label="工作量评估" name="effortAssessmentmenu"></el-tab-pane>
            <el-tab-pane label="风险评估" name="riskAssessment"></el-tab-pane>
            <el-tab-pane label="评估结果" name="standards"></el-tab-pane>
            <el-tab-pane label="功能点审核" name="review"></el-tab-pane>
        </el-tabs>
        <div class="header-buttons">
            <el-button class="export-button">导出项目</el-button>
            <el-button class="export-button">导出评估结果</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref,watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { TabsPaneContext } from 'element-plus';

const router = useRouter();
const route = useRoute();
const activeTab = ref(route.path || '/FunctionPointEvaluation'); // 根据路由设置初始选项卡

const clickBtn = (pane: TabsPaneContext) => {
    const { props } = pane;
    activeTab.value = props.name as string; // 设置选中的选项卡
    router.push({ path: props.name as string }); // 根据 name 属性跳转
};
// 监听路由变化，更新 activeTab
watch(
    () => route.path,
    (newPath) => {
        activeTab.value = newPath;
    }
);
</script>

<style lang="scss" scoped>
.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;


    .header-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-right: 150px; /* 添加标题与选项卡的间距 */
    }

    .recommend-tag {
        font-size: 12px;
        background-color: #eaf5ea;
        color: #67c23a;
    }

    .timestamp {
        font-size: 12px;
        color: #909399;
    }

    .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 10;

    .header-title {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-right: 150px; /* 添加标题与选项卡的间距 */
    }

    .demo-tabs {
        flex: 1;
        margin-right: 20px;


        .el-tabs__header {
            background-color: #f0f2f5; /* 选项卡区域背景为灰色 */
            border-bottom: none;
        }
        .el-tabs__header {
            background-color: #f0f2f5;
            border-bottom: 1px solid #dcdfe6;
            padding: 0 0 0 0; /* 设置上下左右的 padding 为 0，避免多余的内边距 */
            height: 10px; /* 根据需要调整高度，确保与 el-tabs__nav-wrap 一致 */
            box-sizing: border-box; /* 确保 border 和 padding 被包含在高度中 */
        }

        .el-tabs__nav-wrap.is-top {
            background-color: #fff;
            border-bottom: 1px solid #dcdfe6;
            padding: 0 0 0 0; /* 移除多余的内边距 */
            height: 40px; /* 设置相同的高度 */
            box-sizing: border-box; /* 确保 border 和 padding 被包含在高度中 */
        }

        .el-tabs__item {
            color: #606266;
            font-size: 14px;
            padding: 12px 20px;
            transition: all 0.3s ease;
            background-color: #f0f2f5; /* 未选中项背景灰色 */
            border-right: 1px solid #dcdfe6; /* 分隔效果 */
        }

        .el-tabs__item:hover {
            color: #409eff;
        }

        .el-tabs__item.is-active {
            color: #409eff;
            background-color: #ffffff; /* 选中的选项卡背景为白色 */
            font-weight: bold;
            border-bottom: 2px solid #409eff;
        }
    }

    .header-buttons {
        display: flex;

        .export-button {
            font-size: 14px;
            font-weight: bold;
            color: #606266;
            background-color: #f0f2f5;
            border: 1px solid #dcdfe6;
        }
    }
}
    .header-buttons {
        display: flex;
        gap: 10px;

        .export-button {
            font-size: 14px;
            font-weight: bold;
            color: #606266;
            background-color: #f0f2f5;
            border: 1px solid #dcdfe6;
        }
    }
}
</style>
