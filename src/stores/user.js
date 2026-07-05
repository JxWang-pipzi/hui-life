import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'
import { getStoredUser, getToken, removeStoredUser, removeToken, setStoredUser, setToken } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: getStoredUser(),
  }),
  getters: {
    isLogin: (state) => Boolean(state.token),
    isAdmin: (state) => state.userInfo?.role === 'admin',
  },
  actions: {
    async login(form) {
      const result = await loginApi(form)
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
