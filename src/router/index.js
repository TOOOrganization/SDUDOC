import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/img/',
      component: () => import('@/components/TestImgProcess.vue')
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('@/pages/Index.vue') }
      ]
    },
    {
      path: '/index',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [{
        path: '',
        name: 'index',
        component: () => import('@/pages/Index.vue')
      }]
    },
    {
      path: '/loading',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [{
        path: '',
        name: 'loading',
        component: () => import('@/pages/Loading.vue')
      }]
    },
    {
      path: '/editor',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [{
        path: '',
        name: 'editor',
        component: () => import('@/pages/Editor.vue')
      }]
    },
  ]
})
