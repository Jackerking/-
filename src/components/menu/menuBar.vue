<template>
    <menulogo></menulogo>
    <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" 
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    unique-opened   
    active-text-color="#ffd04b" background-color="#545c64"  text-color="#fff" router>
       <menuItem :menuList="menuList"></menuItem>

    </el-menu>
</template>

<script setup lang="ts">

import { ref ,reactive ,computed} from 'vue';
import menuItem from './menuItem.vue';
import menulogo from './menulogo.vue';
import {useRoute} from 'vue-router';
import { menuStore } from '../../store/menu';

const route =useRoute();
const store = menuStore();

const defaultActive = computed(()=>{
    const{path}=route;
    console.log("path===>"+path)
    return path;
})
// const isCollapse = ref(true)

const isCollapse=computed(()=>{
    return store.getCollapse
})

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
let menuList= reactive([
    {
        path:"/home",
        name:"home",
        component:"layout",
        meta:{
            title:"主页",
            icon:"menu",
            roles:["sys:sysyem"]
        },
    },
    {
            path:"/costStandard",
    name:"costStandard",
    component:"/system/resource/costStandard",
    meta:{
            title:"造价标准",
            icon:"User",
            roles:["sys:costStandard"]
        },
    },
    {
    path:"/industryData",
    name:"industryData",
    component:"/system/resource/industryData",
    meta:{
            title:"行业数据",
            icon:"Menu",
            roles:["sys:industryData"]
        },
    },
    
    
])
</script>



<style lang="scss" scoped>
:deep(.el-sub-menu .el-menu-item){
background-color:#1f2d3d
}
:deep(.el-sub-menu .el-menu-item:hover){
    background-color:#001528
}
:deep(.el-menu-item.is-active){
    color: #ffed49
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

        </style>