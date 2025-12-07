<template>
  <b-row class="justify-content-center">
    <b-col cols="12" md="6">
      <b-card title="Register">
        <b-form @submit.prevent="onSubmit">
          <b-form-group label="Username" label-for="username">
            <b-form-input
              id="username"
              v-model="username"
              required
            />
          </b-form-group>

          <b-form-group label="Email" label-for="email">
            <b-form-input
              id="email"
              v-model="email"
              type="email"
              required
            />
          </b-form-group>

          <b-form-group label="Password" label-for="password">
            <b-form-input
              id="password"
              v-model="password"
              type="password"
              required
            />
          </b-form-group>

          <b-button type="submit" variant="primary" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </b-button>
        </b-form>

        <p class="mt-3 text-center">
            Already a user?
            <router-link to="/login">Login</router-link>
        </p>

      </b-card>
    </b-col>
  </b-row>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../services/api';

const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const toast = useToast();

const onSubmit = async () => {
  if (!username.value || !email.value || !password.value) {
    toast.error('All fields are required');
    return;
  }

  loading.value = true;
  try {
    await api.post('/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    toast.success('Registered successfully, please login');
    router.push({ name: 'Login' });
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Registration failed');
  } finally {
    loading.value = false;
  }
};
</script>
