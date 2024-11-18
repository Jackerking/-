<template>
    <!-- 遍历menuList渲染菜单项 -->
    <template v-for="menu in menuList" :key="menu.path">
        <!-- 如果存在子菜单，则使用el-sub-menu -->
        <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
            <template #title>
                <el-icon>
                    <component :is="menu.meta.icon"></component>
                </el-icon>
                <span>{{ menu.meta.title }}</span>
            </template>
            
            <!-- 渲染二级子菜单项，不再递归 -->
            <el-menu-item
                v-for="subMenu in menu.children"
                :key="subMenu.path"
                :index="subMenu.path"
            >
                <el-icon>
                    <component :is="subMenu.meta.icon"></component>
                </el-icon>
                <span>{{ subMenu.meta.title }}</span>
            </el-menu-item>
        </el-sub-menu>
        
        <!-- 如果没有子菜单，则直接使用el-menu-item -->
        <el-menu-item v-else :index="menu.path">
            <el-icon>
                <component :is="menu.meta.icon"></component>
            </el-icon>
            <span>{{ menu.meta.title }}</span>
        </el-menu-item>
    </template>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(["menuList"]);
</script>

<!-- 样式部分保持不变 -->