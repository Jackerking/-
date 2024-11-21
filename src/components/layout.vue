<template>
  <el-container class="layout">
      <el-aside v-if="show" width="200px" class="aside">
        <menu-bar></menu-bar>
      </el-aside>
      <el-container>
       
        <el-main class="main">
          <!-- 删除了 Tabs 组件 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import menuBar from './menu/menuBar.vue';
  import Header from './header/header.vue';
  import { menuStore } from '../store/menu';
  import { computed } from 'vue';
  
  const store = menuStore();
  const show = computed(() => {
    return !store.getCollapse;
  });
  </script>
  
  <style lang="scss" scoped>
  .layout {
    height: 100%;
    background-color: #f7f7f7; // 浅灰色背景，给人一种干净、现代的感觉
  
    .aside {
      background-color: #545c64; // 深蓝色侧边栏，稳重且易于阅读
      color: #fff;
    }
  
    .header {
      background-color: #c4c0c0; // 浅红色头部，吸引注意力但不过于强烈
      display: flex;
      align-items: center;
    }
  
    .main {
      background-color: #fff; // 白色主要内容区域，易于阅读
    }
  
    .footer {
      background-color: #fff; // 深灰色页脚，与头部形成对比
      color: #fff; // 白色文字，确保可读性
    }
  }
  </style>
  