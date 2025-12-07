import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../store/auth';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Subjects from '../views/Subjects.vue';
import Tasks from '../views/Tasks.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', redirect: '/register' },
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  { path: '/register', name: 'Register', component: Register, meta: { public: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/subjects', name: 'Subjects', component: Subjects },
  { path: '/tasks', name: 'Tasks', component: Tasks },
  { path: '/profile', name: 'Profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();

  if (!to.meta.public && !isAuthenticated()) {
    return next({ name: 'Login' });
  }

  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated()) {
    return next({ name: 'Dashboard' });
  }

  next();
});

export default router;
