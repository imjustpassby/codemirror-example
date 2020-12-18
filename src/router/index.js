import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/codeMirror')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/codemirror'
})

export default router
