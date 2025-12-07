<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" class="mb-4">
      <b-navbar-brand href="#">StudyBuddy 2.0</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="isAuthenticated">
          <b-nav-item to="/dashboard">Dashboard</b-nav-item>
          <b-nav-item to="/subjects">Subjects</b-nav-item>
          <b-nav-item to="/tasks">Tasks</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ms-auto">
          <template v-if="isAuthenticated">
            <b-nav-item to="/profile">{{ auth.state.user?.username }}</b-nav-item>
            <b-nav-item @click="logout">Logout</b-nav-item>
          </template>
          <template v-else>
            <b-nav-item to="/login">Login</b-nav-item>
            <b-nav-item to="/register">Register</b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container class="mb-5">
      <router-view />
    </b-container>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './store/auth';

const auth = useAuth();
const router = useRouter();

const isAuthenticated = computed(() => !!auth.state.token);

const logout = () => {
  auth.clearAuth();
  router.push({ name: 'Login' });
};
</script>
