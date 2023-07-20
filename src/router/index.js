import Vue from 'vue'
import VueRouter from 'vue-router'
import MyBoard from '../components/MyBoard.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/myboard' },
  { path: '/myboard', component: MyBoard }
]

const router = new VueRouter({
  routes
})

export default router
