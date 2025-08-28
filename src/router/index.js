import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import StockList from '../views/StockList.vue'
import AddStock from '../views/AddStock.vue'
import EditStock from '../views/EditStock.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock',
    name: 'StockList',
    component: StockList,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock/add',
    name: 'AddStock',
    component: AddStock,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock/edit/:id',
    name: 'EditStock',
    component: EditStock,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router