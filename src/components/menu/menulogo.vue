
<template>
<div class="logo">
<img :src="menulogo" class="llo"></img>
<span v-if="show" class="title">{{ title }}</span>
</div>
    </template>
    
    <script setup lang="ts">
    import menulogo from '@/assets/logo.png'
import { watch, ref } from 'vue';
import { menuStore } from '../../store/menu';

    
    const title= ref('测盟汇')
    const store = menuStore();
// const show=computed(()=>{
// return !store.getCollapse
// })
const show= ref(true)
watch(
    ()=>store.getCollapse,
    (collapse:boolean)=>{
        if(!collapse){
            setTimeout(() => {
                show.value=!collapse
            }, 3000
        );
        }else{
            show.value=!collapse
        }
    }
)

    </script>
    
    
    
    <style lang="scss" scoped>
    .logo{
        display: flex;
        width: 100%;
        height: 60px;
        background-color:#001425;
        cursor:pointer;
        text-align: center;
        align-items: center;

    }
    .llo{
        width: 50px;
        height: 50px;
        margin-right: 25px;
        margin-left: 0px;
    }
    .title{
        color: #ffff;
        font-size:21px;
        font-family: 宋体;
        

      


    }

    
    </style>
    