
<template>
    <div class="header">
        <Collapse></Collapse>
        <BreadCrumb></BreadCrumb>
    </div>

    </template>
    
    <script setup lang="ts">
    import Collapse from './Collapse.vue'
    import BreadCrumb from './Breadcrumb.vue'
    </script>
    
    
    
    <style lang="scss" scoped>
    
    .header{
        display: flex;
        align-items: center;
        .el-icon{
            margin-right: 10px
        }
    }
    </style>
    