import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);

export function checkAuth() {
  const token = localStorage.getItem('token');
/*
  isAuthenticated.set(!!token);
*/
  isAuthenticated.set(true);

}

export function logout() {
  localStorage.removeItem('token');
  isAuthenticated.set(false);
}