export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function setAccessToken(token: string): void {
  localStorage.setItem('accessToken', token);
}

export function removeAccessToken(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
