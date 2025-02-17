export class TokenManager {
  private static readonly AUTH_TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user';

  setToken(token: string): void {
    localStorage.setItem(TokenManager.AUTH_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TokenManager.AUTH_TOKEN_KEY);
  }

  setUser(user: any): void {
    localStorage.setItem(TokenManager.USER_KEY, JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem(TokenManager.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number {
    const user = this.getUser();
    return user?.id || 0;
  }

  clearToken(): void {
    localStorage.removeItem(TokenManager.AUTH_TOKEN_KEY);
    localStorage.removeItem(TokenManager.USER_KEY);
  }
} 