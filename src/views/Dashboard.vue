<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-content">
        <h1>Tableau de Bord</h1>
        <div class="user-menu">
          <span class="user-name">{{ currentUser?.username }}</span>
          <button @click="handleLogout" class="logout-btn">Déconnexion</button>
        </div>
      </div>
    </header>
    <main class="main-content">
      <div class="welcome-section">
        <h2>Bienvenue, {{ currentUser?.username }} !</h2>
        <p>Gérez efficacement votre stock avec notre système efficace.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>{{ totalStocks }}</h3>
            <p>Articles en stock</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ activeStocks }}</h3>
            <p>Articles actifs</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <h3>{{ inactiveStocks }}</h3>
            <p>Articles inactifs</p>
          </div>
        </div>
      </div>
      <div class="actions-section">
        <h3>Actions rapides</h3>
        <div class="action-buttons">
          <router-link to="/stock" class="action-btn primary">
            📋 Voir le stock
          </router-link>
          <router-link to="/stock/add" class="action-btn secondary">
            ➕ Ajouter un article
          </router-link>
        </div>
      </div>
      <div class="recent-activity">
        <h3>Activité récente</h3>
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="recentStocks.length === 0" class="empty-state">
          <p>Aucun article en stock pour le moment.</p>
          <router-link to="/stock/add" class="empty-action">Ajouter votre premier article</router-link>
        </div>
        <div v-else class="stock-list">
          <div v-for="stock in recentStocks" :key="stock.id" class="stock-item">
            <div class="stock-info">
              <h4>{{ stock.name }}</h4>
              <p>{{ stock.description }}</p>
              <span class="status" :class="stock.status">{{ stock.status }}</span>
            </div>
            <div class="stock-actions">
              <router-link :to="`/stock/edit/${stock.id}`" class="edit-link">Modifier</router-link>
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
  name: 'Dashboard',
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('stock', ['allStocks', 'loading']),
    totalStocks() {
      return this.allStocks.length
    },
    activeStocks() {
      return this.allStocks.filter(stock => stock.status === 'active').length
    },
    inactiveStocks() {
      return this.allStocks.filter(stock => stock.status === 'inactive').length
    },
    recentStocks() {
      return this.allStocks.slice(0, 5)
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('stock', ['fetchStocks']),
    handleLogout() {
      this.logout()
      console.log('Déconnexion avec succes')
      this.$router.push('/login')
    }
  },
  async created() {
    await this.fetchStocks()
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
}

.header {
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

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.welcome-section {
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-section h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #666;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  border-radius: 50%;
}

.stat-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: #666;
  font-size: 0.875rem;
}

.actions-section {
  margin-bottom: 3rem;
}

.actions-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.recent-activity h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state {
  background: white;
  padding: 3rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-action {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
}

.stock-list {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.stock-item:last-child {
  border-bottom: none;
}

.stock-info h4 {
  color: #333;
  margin-bottom: 0.25rem;
}

.stock-info p {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.edit-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
}

.edit-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .stock-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>