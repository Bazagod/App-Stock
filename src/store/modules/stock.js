import api from '../../services/api'

const state = {
  stocks: [],
  currentStock: null,
  loading: false,
  error: null
}

const getters = {
  allStocks: state => state.stocks,
  currentStock: state => state.currentStock,
  loading: state => state.loading,
  error: state => state.error
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_STOCKS(state, stocks) {
    state.stocks = stocks
  },
  SET_CURRENT_STOCK(state, stock) {
    state.currentStock = stock
  },
  ADD_STOCK(state, stock) {
    state.stocks.push(stock)
  },
  UPDATE_STOCK(state, updatedStock) {
    const index = state.stocks.findIndex(stock => stock.id === updatedStock.id)
    if (index !== -1) {
      state.stocks.splice(index, 1, updatedStock)
    }
  },
  REMOVE_STOCK(state, stockId) {
    state.stocks = state.stocks.filter(stock => stock.id !== stockId)
  }
}

const actions = {
  async fetchStocks({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.get('/stocks')
      commit('SET_STOCKS', response.data)
      
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchStock({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.get(`/stocks/${id}`)
      commit('SET_CURRENT_STOCK', response.data)
      
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createStock({ commit }, stockData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.post('/stocks', stockData)
      commit('ADD_STOCK', response.data)
      
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la création')
      return { success: false, error: error.response?.data?.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateStock({ commit }, { id, stockData }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.put(`/stocks/${id}`, stockData)
      commit('UPDATE_STOCK', response.data)
      
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la modification')
      return { success: false, error: error.response?.data?.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteStock({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      await api.delete(`/stocks/${id}`)
      commit('REMOVE_STOCK', id)
      
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la suppression')
      return { success: false, error: error.response?.data?.message }
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}