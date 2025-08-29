<template>
  <div class="add-stock-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/stock" class="back-link">← Retour à la liste</router-link>
          <h1>Ajouter un article</h1>
        </div>
        <div class="user-menu">
          <span class="user-name">{{ currentUser?.username }}</span>
          <button @click="handleLogout" class="logout-btn">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="stock-form">
          <div class="form-group">
            <label for="name">Nom de l'article *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              :disabled="loading"
              placeholder="Entrez le nom de l'article"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="form.description"
              required
              :disabled="loading"
              placeholder="Décrivez l'article en détail"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="status">Statut *</label>
            <select
              id="status"
              v-model="form.status"
              required
              :disabled="loading"
              class="form-select"
            >
              <option value="">Sélectionnez un statut</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div v-if="error" class="error-message">
            <div class="error-icon">⚠️</div>
            <div>
              <strong>Erreur :</strong> {{ error }}
            </div>
          </div>

          <div class="form-actions">
            <router-link to="/stock" class="cancel-btn">
              Annuler
            </router-link>
            <button type="submit" :disabled="loading || !isFormValid" class="submit-btn">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Création en cours...' : 'Créer l\'article' }}
            </button>
          </div>
        </form>

        <div class="form-preview">
          <h3>Aperçu</h3>
          <div class="preview-card">
            <div class="preview-header">
              <h4>{{ form.name || 'Nom de l\'article' }}</h4>
              <span class="status-preview" :class="form.status || 'default'">
                {{ form.status || 'Statut' }}
              </span>
            </div>
            <div class="preview-body">
              <p>{{ form.description || 'Description de l\'article...' }}</p>
            </div>
            <div class="preview-footer">
              <span class="preview-date">Créé le {{ currentDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddStock',
  data() {
    return {
      form: {
        name: '',
        description: '',
        status: ''
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('stock', ['loading', 'error']),
    isFormValid() {
      return this.form.name.trim() && 
             this.form.description.trim() && 
             this.form.status
    },
    currentDate() {
      return new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('stock', ['createStock']),
    handleLogout() {
      this.logout()
      console.log('Déconnexion avec succes')
      this.$router.push('/login')
    },
    async handleSubmit() {
      if (!this.isFormValid) return
      
      const result = await this.createStock(this.form)
      if (result.success) {
        this.$router.push('/stock')
      }
    }
  }
}
</script>

<style scoped>
.add-stock-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: white;
}

.header-left h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.stock-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input:disabled,
.form-textarea:disabled,
.form-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  margin-bottom: 1.5rem;
}

.error-icon {
  font-size: 1.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-preview {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 2rem;
}

.form-preview h3 {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.preview-card {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.preview-header h4 {
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
}

.status-preview {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-preview.active {
  background: #dcfce7;
  color: #166534;
}

.status-preview.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-preview.default {
  background: #f3f4f6;
  color: #6b7280;
}

.preview-body p {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
}

.preview-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.preview-date {
  color: #9ca3af;
  font-size: 0.875rem;
}

@media (max-width: 968px) {
  .form-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-preview {
    position: static;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    justify-content: center;
  }
}
</style>