<template>
  <div class="edit-stock-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/stock" class="back-link">← Retour à la liste</router-link>
          <h1>Modifier l'article</h1>
        </div>
        <div class="user-menu">
          <span class="user-name">{{ currentUser?.username }}</span>
          <button @click="handleLogout" class="logout-btn">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading && !form.name" class="loading-container">
        <div class="spinner"></div>
        <p>Chargement de l'article...</p>
      </div>

      <div v-else-if="error && !currentStock" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Erreur de chargement</h3>
        <p>{{ error }}</p>
        <button @click="loadStock" class="retry-btn">Réessayer</button>
      </div>

      <div v-else class="form-container">
        <form @submit.prevent="handleSubmit" class="stock-form">
          <div class="form-header">
            <h2>Informations de l'article</h2>
            <div class="article-id">ID: {{ $route.params.id }}</div>
          </div>

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

          <div v-if="error && currentStock" class="error-message">
            <div class="error-icon">⚠️</div>
            <div>
              <strong>Erreur :</strong> {{ error }}
            </div>
          </div>

          <div class="form-meta">
            <div class="meta-item">
              <strong>Créé le :</strong> {{ formatDate(currentStock?.created_at) }}
            </div>
            <div class="meta-item" v-if="currentStock?.updated_at && currentStock.updated_at !== currentStock.created_at">
              <strong>Modifié le :</strong> {{ formatDate(currentStock.updated_at) }}
            </div>
          </div>

          <div class="form-actions">
            <router-link to="/stock" class="cancel-btn">
              Annuler
            </router-link>
            <button type="submit" :disabled="loading || !isFormValid || !hasChanges" class="submit-btn">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Modification en cours...' : 'Enregistrer les modifications' }}
            </button>
          </div>
        </form>

        <div class="form-preview">
          <h3>Aperçu des modifications</h3>
          
          <div class="comparison">
            <div class="comparison-section">
              <h4>Avant</h4>
              <div class="preview-card original">
                <div class="preview-header">
                  <h5>{{ currentStock?.name || 'Nom original' }}</h5>
                  <span class="status-preview" :class="currentStock?.status || 'default'">
                    {{ currentStock?.status || 'Statut original' }}
                  </span>
                </div>
                <div class="preview-body">
                  <p>{{ currentStock?.description || 'Description originale...' }}</p>
                </div>
              </div>
            </div>

            <div class="comparison-arrow">→</div>

            <div class="comparison-section">
              <h4>Après</h4>
              <div class="preview-card modified" :class="{ 'has-changes': hasChanges }">
                <div class="preview-header">
                  <h5>{{ form.name || 'Nom de l\'article' }}</h5>
                  <span class="status-preview" :class="form.status || 'default'">
                    {{ form.status || 'Statut' }}
                  </span>
                </div>
                <div class="preview-body">
                  <p>{{ form.description || 'Description de l\'article...' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="hasChanges" class="changes-summary">
            <h4>Modifications détectées</h4>
            <ul class="changes-list">
              <li v-if="form.name !== currentStock?.name" class="change-item">
                <strong>Nom :</strong> "{{ currentStock?.name }}" → "{{ form.name }}"
              </li>
              <li v-if="form.description !== currentStock?.description" class="change-item">
                <strong>Description :</strong> Modifiée
              </li>
              <li v-if="form.status !== currentStock?.status" class="change-item">
                <strong>Statut :</strong> "{{ currentStock?.status }}" → "{{ form.status }}"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'EditStock',
  data() {
    return {
      form: {
        name: '',
        description: '',
        status: ''
      },
      originalStock: null
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('stock', ['currentStock', 'loading', 'error']),
    isFormValid() {
      return this.form.name.trim() && 
             this.form.description.trim() && 
             this.form.status
    },
    hasChanges() {
      if (!this.originalStock) return false
      
      return this.form.name !== this.originalStock.name ||
             this.form.description !== this.originalStock.description ||
             this.form.status !== this.originalStock.status
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('stock', ['fetchStock', 'updateStock']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    },
    async loadStock() {
      const stockId = this.$route.params.id
      await this.fetchStock(stockId)
      
      if (this.currentStock) {
        this.form = {
          name: this.currentStock.name,
          description: this.currentStock.description,
          status: this.currentStock.status
        }
        this.originalStock = { ...this.currentStock }
      }
    },
    async handleSubmit() {
      if (!this.isFormValid || !this.hasChanges) return
      
      const stockId = this.$route.params.id
      const result = await this.updateStock({ 
        id: stockId, 
        stockData: this.form 
      })
      
      if (result.success) {
        this.$router.push('/stock')
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Non défini'
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  async created() {
    await this.loadStock()
  }
}
</script>

<style scoped>
.edit-stock-page {
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

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: #dc2626;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
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

.form-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-header h2 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.article-id {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
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

.form-meta {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.meta-item {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.meta-item:last-child {
  margin-bottom: 0;
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
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.comparison-section h4 {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.comparison-arrow {
  color: #667eea;
  font-size: 1.5rem;
  font-weight: bold;
}

.preview-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.preview-card.original {
  background: #f9fafb;
}

.preview-card.modified.has-changes {
  border-color: #667eea;
  background: #f0f4ff;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.preview-header h5 {
  color: #374151;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 0.5rem;
}

.status-preview {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
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
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
}

.changes-summary {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
}

.changes-summary h4 {
  color: #0369a1;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-item {
  color: #0369a1;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.change-item:last-child {
  margin-bottom: 0;
}

.change-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #0369a1;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-preview {
    position: static;
  }

  .comparison {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .comparison-arrow {
    transform: rotate(90deg);
    justify-self: center;
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

  .preview-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>