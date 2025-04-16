import { user, isAuthenticated } from './store';

export function handleSessionExpiration() {
    // Clear user data from store
    user.set(null);
    isAuthenticated.set(false);
    // Clear localStorage
    localStorage.removeItem('user');
    // Redirect to home page
    window.location.href = '/';
}

export function checkSessionExpiration(error) {
    if (error.response?.status === 401) {
        handleSessionExpiration();
    }
} 