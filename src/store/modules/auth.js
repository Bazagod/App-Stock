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
    state.error = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await api.post('/login', credentials)
      const { user, token } = response.data

      commit('SET_USER', user)
      commit('SET_TOKEN', token)

      return { success: true, message: 'Connexion réussie' }
    } catch (error) {
      const msg = error.response?.data?.message || 'Email ou mot de passe incorrect'
      commit('SET_ERROR', msg)
      return { success: false, message: msg }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await api.post('/register', userData)
      const { user, token } = response.data

      commit('SET_USER', user)
      commit('SET_TOKEN', token)

      return { success: true, message: 'Inscription réussie' }
    } catch (error) {
      const msg = error.response?.data?.message || "Erreur lors de l'inscription"
      commit('SET_ERROR', msg)
      return { success: false, message: msg }
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
