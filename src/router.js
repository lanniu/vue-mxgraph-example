import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const demoRouter = [
  {
    path: 'welcome',
    name: 'welcome',
    meta: {
      title: '欢迎页'
    },
    component: () => import('@/views/example/welcome')
  },
  {
    path: 'cascadeDelete',
    name: 'cascadeDelete',
    meta: {
      title: '联级删除'
    },
    component: () => import('@/views/example/cascadeDelete')
  },
  {
    path: 'toolbar',
    name: 'toolbar',
    meta: {
      title: '工具箱'
    },
    component: () => import('@/views/example/toolbar')
  }
]

export const globalRouter = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    component: () => import('./views/Home.vue'),
    children: [
      ...demoRouter
    ]
  },
]

export default new Router({
  mode: 'history',
  routes: [...globalRouter]
})
