import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi } from '@/api/auth'
import { getStoredUser, getToken, removeStoredUser, removeToken, setStoredUser, setToken } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: getStoredUser(),
  }),
  getters: {
    isLogin: (state) => Boolean(state.token),
    isAdmin: (state) => state.userInfo?.role === 'admin',
    isMerchant: (state) => state.userInfo?.role === 'merchant',
    permissions: (state) => state.userInfo?.permissions || [],
    hasPermission: (state) => (permission) => {
      if (!permission) return true
      return (state.userInfo?.permissions || []).includes(permission)
    },
  },
  actions: {
    async login(form) {
      const result = await loginApi(form)
      this.token = result.token
      this.userInfo = result.user
      setToken(result.token)
      setStoredUser(result.user)
    },
    async register(form) {
      const result = await registerApi(form)
      this.token = result.token
      this.userInfo = result.user
      setToken(result.token)
      setStoredUser(result.user)
    },
    logout() {
      this.token = ''
      this.userInfo = null
      removeToken()
      removeStoredUser()
    },
  },
})
