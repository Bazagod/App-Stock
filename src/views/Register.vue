<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Inscrivez-vous</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            :disabled="loading"
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="loading"
            placeholder="votreadresse@email.com"
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="loading"
            placeholder="********"
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>
      <p class="login-link">
        Déjà un compte ? <router-link to="/login">Connectez-vous</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['register']),
    async handleRegister() {
      const result = await this.register(this.form)
      if (result.success) {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.875rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
}

.register-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>