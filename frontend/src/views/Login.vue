<template>
  <b-row class="justify-content-center">
    <b-col cols="12" md="6">
      <b-card title="Login">
        <b-form @submit.prevent="onSubmit">
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

          <!-- Remember me -->
           <b-form-group>
            <b-form-checkbox v-model="rememberMe">
                Remember me
            </b-form-checkbox>
        </b-form-group>

          <b-button type="submit" variant="primary" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../services/api';
import { useAuth } from '../store/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const toast = useToast();
const auth = useAuth();

const onSubmit = async () => {
  if (!email.value || !password.value) {
    toast.error('Email and password are required');
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value,
    });
    auth.setAuth(res.data.token, res.data.user);
    toast.success('Logged in successfully');
    router.push({ name: 'Dashboard' });
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    loading.value = false;
  }
};
</script>
