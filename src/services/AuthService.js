import { AuthRepository } from '@/repositories/AuthRepository'

export const AuthService = {
  async login(email, password) {
    return AuthRepository.login(email, password)
  },

  async logout() {
    return AuthRepository.logout()
  },

  async getSession() {
    return AuthRepository.getSession()
  },

  async getUser() {
    return AuthRepository.getUser()
  }
}
