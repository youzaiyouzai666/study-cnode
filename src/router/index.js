import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/views/index.vue')
const List = () => import('@/views/list.vue')
const Topic = () => import('@/views/topic.vue')

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:'/list',
      name:'list',
      component: List
    },
    {
      path:'/topic/:id',
      name:'topic',
      component: Topic
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
