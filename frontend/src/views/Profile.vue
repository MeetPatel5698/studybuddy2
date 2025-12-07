<template>
  <div>
    <h2>Profile</h2>
    <b-card>
      <p><strong>Username:</strong> {{ auth.state.user?.username }}</p>
      <p><strong>Email:</strong> {{ auth.state.user?.email }}</p>
      <p><strong>Role:</strong> {{ auth.state.user?.role }}</p>
    </b-card>
  </div>
</template>

<script setup>
import { useAuth } from '../store/auth';

const auth = useAuth();
</script>
