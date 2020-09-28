import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: HelloWorld,
    redirect: "/index",
    children: [
      {
        path: "dictData",
        name: "字典数据",
        component: resolve => require(["@/views/system/dict/dictData"],resolve)
      }
    ]
  },{
    path: "/404",
    component: resolve => require(["@/views/error/404"],resolve),
    hidden: true
  }
];

export default new Router({
  mode: "history",
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})
