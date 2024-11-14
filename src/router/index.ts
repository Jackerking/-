import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
 import Layout from '../components/layout.vue'

const routes: Array<RouteRecordRaw> = [
  
  {
    //路由初始指向
      path: "/",
      component:Layout,
      redirect: "/home",
      children:[
        {
          path:"/home",
          name:"home",
          component: () => import("../views/home/home.vue"),
          meta:{
            title:"首页",
            icon:"menu",
        },

        }
      ]
    },
  
    {
      path:"/system",
      name:"system",
      component:Layout,
      meta:{
          title:"管理系统",
          icon:"menu",

      },
      children:[
{
  path:"/usermenu",
  name:"user",
  component: () => import("../views/user/usermenu.vue"),
  meta:{
          title:"用户管理",
          icon:"User",
      },
},
{
  path:"/effortAssessmentmenu",
  name:"effortAssessment",
  component: () => import("../views/effortAssessment/effortAssessmentmenu.vue"),
  meta:{
          title:"工作量评估管理",
          icon:"Avatar",
      },
},
{
  path:"/fieldmenu",
  name:"field",
  component: () => import("../views/field/fieldmenu.vue"),
  meta:{
          title:"行业动态",
          icon:"Menu",
      },
},
{
  path:"/costStandard",
  name:"costStandard",
  component: () => import("../views/resource/costStandard.vue"),
  meta:{
          title:"造价标准",
          icon:"Menu",
      },
},
{
  path:"/meetmenu",
  name:"meet",
  component: () => import("../views/meet/meetmenu.vue"),
  meta:{
          title:"会议管理",
          icon:"Menu",
      },
      
},

{
  path:"/industryData",
  name:"industryData",
  component: () => import("../views/resource/industryData.vue"),
      meta:{
          title:"行业数据", 
          icon:"Menu",
  }
},
{
  path:"/fielddetail",
  name:"fielddetail",
  component: () => import("../views/field/fileddetail.vue"),
      meta:{
          title:"行业详情", 
          icon:"Menu",
  }
},
{
  path:"/riskAssessment",
  name:"riskAssessment",
  component: () => import("../views/effortAssessment/riskAssessment.vue"),
      meta:{
          title:"风险评估", 
          icon:"Menu",
  }
},
{
  path:"/userdetail",
  name:"userdetail",
  component: () => import("../views/user/userdetail.vue"),
      meta:{
          title:"用户详情", 
          icon:"Menu",
  }
},
{
  path:"/meetingdetail",
  name:"meetingdetail",
  component: () => import("../views/meet/meetingdetail.vue"),
      meta:{
          title:"会议详情", 
          icon:"Menu",
  }
},
      ]
  }

 
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
