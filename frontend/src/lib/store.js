import { writable } from 'svelte/store';

// User authentication store
export const user = writable(null);
export const isAuthenticated = writable(false);
export const isInitialized = writable(false);

// Initialize from localStorage if available (for persistence)
if (typeof window !== 'undefined') {
    // Load user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            user.set(parsedUser);
            isAuthenticated.set(true);
            // console.log('Loaded user from localStorage:', parsedUser);
        } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
            user.set(null);
            isAuthenticated.set(false);
        }
    }
    isInitialized.set(true);
}

// Update localStorage when user changes
user.subscribe(value => {
    if (typeof window !== 'undefined') {
        if (value) {
            try {
                localStorage.setItem('user', JSON.stringify(value));
                isAuthenticated.set(true);
                // console.log('Updated localStorage with user:', value);
            } catch (error) {
                console.error('Error saving user to localStorage:', error);
                localStorage.removeItem('user');
                isAuthenticated.set(false);
            }
        } else {
            localStorage.removeItem('user');
            isAuthenticated.set(false);
            console.log('Cleared user from localStorage');
        }
    }
});