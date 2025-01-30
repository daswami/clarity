import { v4 as uuidv4 } from 'uuid';

export const generateUserId = () => uuidv4();

export function setUserSession(userId: string, username: string) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('userId', userId);
  localStorage.setItem('username', username);
}

export function getUserSession() {
  if (typeof window === 'undefined') {
    return { userId: null, username: null };
  }
  
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  
  return { userId, username };
}

export function clearUserSession() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
};
