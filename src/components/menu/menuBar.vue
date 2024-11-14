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
        path:"/system",
        name:"system",
        component:"layout",
        meta:{
            title:"管理系统",
            icon:"menu",
            roles:["sys:sysyem"]
        },
        children:[
{
    path:"/usermenu",
    name:"user",
    component:"/system/user/usermenu",
    meta:{
            title:"用户管理",
            icon:"User",
            roles:["sys:user"]
        },
        children:[
        {
            path:"/userdetail",
    name:"userdetail",
    component:"/system/user/userdetail",
    meta:{
            title:"用户详情",
            icon:"Menu",
            roles:["sys:userdetail"]
        },
        },
        {
            path:"/meetcreat",
    name:"meetcreat",
    component:"/system/meet/meetcreat",
    meta:{
            title:"会议创建",
            icon:"Menu",
            roles:["sys:meetcreat"]
        },
        },
        {
            path:"/meetedit",
    name:"meetedit",
    component:"/system/course/meetedit",
    meta:{
            title:"会议编辑", 
            icon:"Menu",
            roles:["sys:meetedit"]
        },
        }
        ]
},
{
    path:"/effortAssessmentmenu",
    name:"effortAssessment",
    component:"/system/effortAssessment/effortAssessmentmenu",
    meta:{
            title:"综合评估",
            icon:"Avatar",
            roles:["sys:effortAssessmentmenu"]
        },
        children:[
        {
            path:"/effortAssessmentmenu",
    name:"effortAssessment",
    component:"/system/effortAssessment/effortAssessmentmenu",
    meta:{
            title:"工作量评估",
            icon:"Menu",
            roles:["sys:effortAssessment"]
        },
        },
        {
            path:"/riskAssessment",
    name:"riskAssessment",
    component:"/system/effortAssessment/riskAssessment",
    meta:{
            title:"风险评估",
            icon:"Menu",
            roles:["sys:riskAssessment"]
        },
        },
        {
            path:"/meetedit",
    name:"meetedit",
    component:"/system/course/meetedit",
    meta:{
            title:"会议编辑", 
            icon:"Menu",
            roles:["sys:meetedit"]
        },
        }
        ]
},
{
    path:"/fieldmenu",
    name:"field",
    component:"/system/field/fieldmenu",
    meta:{
            title:"行业动态",
            icon:"Menu",
            roles:["sys:field"]
        },
        children:[
        {
            path:"/fielddetail",
    name:"fielddetail",
    component:"/system/field/fielddetail",
    meta:{
            title:"行业详情",
            icon:"Menu",
            roles:["sys:fielddetail"]
        },
        },
        {
            path:"/meetcreat",
    name:"meetcreat",
    component:"/system/meet/meetcreat",
    meta:{
            title:"会议创建",
            icon:"Menu",
            roles:["sys:meetcreat"]
        },
        },
        {
            path:"/meetedit",
    name:"meetedit",
    component:"/system/meet/meetedit",
    meta:{
            title:"会议编辑", 
            icon:"Menu",
            roles:["sys:meetedit"]
        },
        }
        ]
},
{
    path:"/costStandard",
    name:"costStandard",
    component:"/system/resource/costStandard",
    meta:{
            title:"资源数据",
            icon:"Menu",
            roles:["sys:costStandard"]
        },
        children:[
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
        {
            path:"/costStandard",
    name:"costStandard",
    component:"/system/resource/costStandard",
    meta:{
            title:"造价标准",
            icon:"Menu",
            roles:["sys:costStandard"]
        },
        },
        {
            path:"/meetedit",
    name:"meetedit",
    component:"/system/course/meetedit",
    meta:{
            title:"会议编辑", 
            icon:"Menu",
            roles:["sys:meetedit"]
        },
        }
        ]
},
{
    path:"/meetmenu",
    name:"meet",
    component:"/system/meet/meetmenu",
    meta:{
            title:"会议管理",
            icon:"Menu",
            roles:["sys:meet"]
        },
        children:[
        {
            path:"/meetingdetail",
    name:"meetingdetail",
    component:"/system/meet/meetingdetail",
    meta:{
            title:"会议详情",
            icon:"Menu",
            roles:["sys:meetingdetail"]
        },
        },
        
        
        ]
}
        ]
    }
    
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