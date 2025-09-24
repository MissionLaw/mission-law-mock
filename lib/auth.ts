import { User } from './types'

export class AuthService {
  private static currentUser: User | null = null

  static getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser')
      if (stored) {
        this.currentUser = JSON.parse(stored)
      }
    }
    return this.currentUser
  }

  static setCurrentUser(user: User | null) {
    this.currentUser = user
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('currentUser')
      }
    }
  }

  static async signIn(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Call the API to authenticate
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const { user } = await response.json()
        this.setCurrentUser(user)
        return user
      }
    } catch (error) {
      console.error('Error during sign in:', error)
    }

    return null
  }

  static signOut() {
    this.setCurrentUser(null)
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static isClient(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'client'
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }
}