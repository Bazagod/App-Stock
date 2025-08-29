<template>
  <div class="stock-list-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/dashboard" class="back-link">← Tableau de bord</router-link>
          <h1>Stock</h1>
        </div>
        <div class="header-actions">
          <span>{{ currentUser?.username }}</span>
          <router-link to="/stock/add" class="add-btn">
            ➕ Ajouter un article
          </router-link>
          <button @click="handleLogout" class="logout-btn">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="filters-section">
        <div class="search-box">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un article..."
            class="search-input"
          />
        </div>
        <div class="filter-buttons">
          <button
            @click="statusFilter = 'all'"
            :class="{ active: statusFilter === 'all' }"
            class="filter-btn"
          >
            Tous
          </button>
          <button
            @click="statusFilter = 'active'"
            :class="{ active: statusFilter === 'active' }"
            class="filter-btn"
          >
            Actifs
          </button>
          <button
            @click="statusFilter = 'inactive'"
            :class="{ active: statusFilter === 'inactive' }"
            class="filter-btn"
          >
            Inactifs
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des articles...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchStocks" class="retry-btn">Réessayer</button>
      </div>

      <div v-else-if="filteredStocks.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>Aucun article trouvé</h3>
        <p v-if="searchTerm">Aucun article ne correspond à votre recherche "{{ searchTerm }}"</p>
        <p v-else>Vous n'avez pas encore d'articles en stock.</p>
        <router-link to="/stock/add" class="add-first-btn">
          Ajouter votre premier article
        </router-link>
      </div>

      <div v-else class="stocks-grid">
        <div v-for="stock in filteredStocks" :key="stock.id" class="stock-card">
          <div class="stock-header">
            <h3>{{ stock.name }}</h3>
            <span class="status" :class="stock.status">{{ stock.status }}</span>
          </div>
          <div class="stock-body">
            <p class="description">{{ stock.description }}</p>
            <div class="stock-meta">
              <span class="created-date">
                Créé le {{ formatDate(stock.created_at) }}
              </span>
            </div>
          </div>
          <div class="stock-actions">
            <router-link :to="`/stock/edit/${stock.id}`" class="action-btn edit">
              ✏️ Modifier
            </router-link>
            <button @click="confirmDelete(stock)" class="action-btn delete">
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer "{{ stockToDelete?.name }}" ?</p>
        <p class="warning">Cette action est irréversible.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="cancel-btn">Annuler</button>
          <button @click="handleDeleteStock" :disabled="loading" class="confirm-btn">
            {{ loading ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'StockList',
  data() {
    return {
      searchTerm: '',
      statusFilter: 'all',
      showDeleteModal: false,
      stockToDelete: null
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('stock', ['allStocks', 'loading', 'error']),
    filteredStocks() {
      let filtered = this.allStocks

      if (this.searchTerm) {
        filtered = filtered.filter(stock =>
          stock.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          stock.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }

      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(stock => stock.status === this.statusFilter)
      }

      return filtered
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('stock', ['fetchStocks', 'deleteStock']),
    
    handleLogout() {
      this.logout()
      console.log('Déconnexion avec succes')
      this.$router.push('/login')
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    confirmDelete(stock) {
      this.stockToDelete = stock
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.stockToDelete = null
    },
    async handleDeleteStock() {
      if (!this.stockToDelete) return
      
      const result = await this.deleteStock(this.stockToDelete.id)
      if (result.success) {
        this.showDeleteModal = false
        this.stockToDelete = null
      }
    }
  },
  async created() {
    await this.fetchStocks()
  }
}
</script>

<style scoped>
.stock-list-page {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.add-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.3);
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

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #64748b;
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

.error-message {
  text-align: center;
  padding: 2rem;
  color: #e11d48;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.add-first-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.add-first-btn:hover {
  transform: translateY(-2px);
}

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.stock-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stock-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stock-header h3 {
  color: #374151;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.stock-body {
  padding: 1rem 1.5rem;
}

.description {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.stock-meta {
  font-size: 0.875rem;
  color: #9ca3af;
}

.stock-actions {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.action-btn.edit {
  background: #e0f2fe;
  color: #0369a1;
}

.action-btn.edit:hover {
  background: #bae6fd;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fecaca;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  color: #374151;
  margin-bottom: 1rem;
}

.modal p {
  color: #64748b;
  margin-bottom: 1rem;
}

.warning {
  color: #dc2626 !important;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-btn:hover {
  border-color: #cbd5e1;
}

.confirm-btn {
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.confirm-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: center;
  }

  .stocks-grid {
    grid-template-columns: 1fr;
  }
}
</style>