
<template>

<el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in  tabs">{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
    </template>
    
    <script setup lang="ts">
    import {watch, Ref,ref } from 'vue';
import { useRoute,RouteLocationMatched } from 'vue-router';
    const route= useRoute()
    const tabs: Ref<RouteLocationMatched[]>=ref([])
    const getBreadCrumb=()=>{
      let matched=  route.matched.filter((item)=>item.meta&&item.meta.title)
      const one = matched[0]
      if(one.path!='/home'){
        matched=[{path:'/home',meta:{title:'首页'}} as any].concat(matched)
      }
      tabs.value=matched
    }
    getBreadCrumb()
    watch(
      ()=>route.path,
      ()=>getBreadCrumb()
    )
    
    
    </script>
    
    
    
    <style lang="scss" scoped>
    :deep(.el-breadcrumb__inner){
      color: #fff  !important
    }
    
    </style>
    