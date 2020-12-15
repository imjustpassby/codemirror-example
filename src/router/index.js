import Vue from 'vue'
import VueRouter from 'vue-router'
import codeMirror from '@/views/codeMirror'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: codeMirror
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
