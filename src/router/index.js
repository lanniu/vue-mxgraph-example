import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const demoRouter = [
  {
    path: 'welcome',
    name: 'welcome',
    meta: {
      title: '欢迎页',
      icon: require('@/assets/icon/home.png')
    },
    component: () => import('@/views/example/welcome')
  },
  {
    path: 'cascadeDelete',
    name: 'cascadeDelete',
    meta: {
      title: '联级删除',
      icon: require('@/assets/icon/delete.png')
    },
    component: () => import('@/views/example/cascadeDelete')
  },
  {
    path: 'toolbar',
    name: 'toolbar',
    meta: {
      title: '工具箱',
      icon: require('@/assets/icon/toolbar.png')
    },
    component: () => import('@/views/example/toolbar')
  },
  {
    path: 'customToolbar',
    name: 'customToolbar',
    meta: {
      title: '自定义工具箱',
      icon: require('@/assets/icon/toolbar2.png')
    },
    component: () => import('@/views/example/customToolbar')
  },
  {
    path: 'stencilToolbar',
    name: 'stencilToolbar',
    meta: {
      title: '模板工具箱',
      icon: require('@/assets/icon/stencil.png')
    },
    component: () => import('@/views/example/stencilToolbar')
  },
  {
    path: 'htmlLabel',
    name: 'htmlLabel',
    meta: {
      title: 'HTML标签',
      icon: require('@/assets/icon/label.png')
    },
    component: () => import('@/views/example/htmlLabel')
  },
  {
    path: 'edgeStyle',
    name: 'edgeStyle',
    meta: {
      title: '连线样式',
      icon: require('@/assets/icon/line.png')
    },
    component: () => import('@/views/example/edgeStyle')
  },
  {
    path: 'customConnectionConstraints',
    name: 'customConnectionConstraints',
    meta: {
      title: '自定义连接点',
      icon: require('@/assets/icon/connectPoint.png')
    },
    component: () => import('@/views/example/customConnectionConstraints')
  },
  {
    path: 'manualDrawing',
    name: 'manualDrawing',
    meta: {
      title: '手动绘图',
      icon: require('@/assets/icon/handler.png')
    },
    component: () => import('@/views/example/manualDrawing')
  },
  {
    path: 'graphEditor',
    name: 'graphEditor',
    meta: {
      title: '简易编辑器',
      icon: require('@/assets/icon/editor.png')
    },
    component: () => import('@/views/example/graphEditor')
  },
  {
    path: 'groupEditor',
    name: 'groupEditor',
    meta: {
      title: '组编辑',
      icon: require('@/assets/icon/group.png')
    },
    component: () => import('@/views/example/groupEditor')
  }
]

export const globalRouter = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    component: () => import('@/views/layout'),
    children: [
      ...demoRouter
    ]
  },
]

export default new Router({
  routes: [...globalRouter]
})
