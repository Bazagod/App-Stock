import api from '../../services/api'

const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
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
  SET_USER(state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.post('/login', credentials)
      const { user, token } = response.data
      
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur de connexion')
      return { success: false, error: error.response?.data?.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.post('/register', userData)
      const { user, token } = response.data
      
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      return { success: true }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de l\'inscription')
      return { success: false, error: error.response?.data?.message }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    commit('CLEAR_AUTH')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}