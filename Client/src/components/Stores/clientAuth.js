import { reactive } from 'vue';

const clientAuth = reactive({
  token: localStorage.getItem('clientToken') || '',
  isAuthenticated: !!localStorage.getItem('clientToken'),

  login(token) {
    this.token = token;
    this.isAuthenticated = true;
    localStorage.setItem('clientToken', token);
  },

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    localStorage.removeItem('clientToken');
  }
});

export default clientAuth;