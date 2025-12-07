import { reactive } from 'vue';

const state = reactive({
  token: localStorage.getItem('sb_token') || null,
  user: JSON.parse(localStorage.getItem('sb_user') || 'null'),
});

export function useAuth() {
  const isAuthenticated = () => !!state.token;

  const setAuth = (token, user) => {
    state.token = token;
    state.user = user;
    localStorage.setItem('sb_token', token);
    localStorage.setItem('sb_user', JSON.stringify(user));
  };

  const clearAuth = () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
  };

  return {
    state,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
}
