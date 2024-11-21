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
  path:"/FunctionPointEvaluation",
  name:"FunctionPointEvaluation",
  component: () => import("../views/effortAssessment/FunctionPointEvaluation.vue"),
  meta:{
          title:"功能点评估",
          icon:"Menu",
      },
      
},
{
  name: 'FunctionPointsIdentify',
  path: '/functionPointsIdentify',
  component: () => import("../views/effortAssessment/FunctionPointsIdentify.vue"),
  meta:{
          title:"功能点评估",
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
  path:"/industryData2",
  name:"industryData2",
  component: () => import("../views/resource/industryData2.vue"),
      meta:{
          title:"行业数据", 
          icon:"Menu",
  }
},
{
  path:"/result",
  name:"result",
  component: () => import("../views/result/result.vue"),
      meta:{
          title:"评估结果详情", 
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
  path:"/Standards",
  name:"Standards",
  component: () => import("../views/effortAssessment/Standards.vue"),
      meta:{
          title:"用户详情", 
          icon:"Menu",
  }
},
{
  path:"/fileddetail",
  name:"fileddetail",
  component: () => import("../views/field/fileddetail.vue"),
  meta:{
          title:"上传文件",
          icon:"Menu",
      },
},
      ]
  }

 
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
