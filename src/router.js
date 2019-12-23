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
  },
  {
    path: 'customToolbar',
    name: 'customToolbar',
    meta: {
      title: '自定义工具箱'
    },
    component: () => import('@/views/example/customToolbar/customToolbar')
  },
  {
    path: 'htmlLabel',
    name: 'htmlLabel',
    meta: {
      title: 'HTML标签'
    },
    component: () => import('@/views/example/htmlLabel/htmlLabel')
  },
  {
    path: 'edgeStyle',
    name: 'edgeStyle',
    meta: {
      title: '连线样式'
    },
    component: () => import('@/views/example/edgeStyle/edgeStyle')
  },
  {
    path: 'customConnectionConstraints',
    name: 'customConnectionConstraints',
    meta: {
      title: '自定义连接点'
    },
    component: () => import('@/views/example/customConnectionConstraints/customConnectionConstraints')
  },
  {
    path: 'manualDrawing',
    name: 'manualDrawing',
    meta: {
      title: '手动绘图'
    },
    component: () => import('@/views/example/manualDrawing/manualDrawing')
  },
  {
    path: 'stencilToolbar',
    name: 'stencilToolbar',
    meta: {
      title: 'mxStencil + toolbar'
    },
    component: () => import('@/views/example/stencilToolbar/stencilToolbar')
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
  routes: [...globalRouter]
})
