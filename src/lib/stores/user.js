import { writable } from 'svelte/store';

// Simple user store for login state
export const user = writable({ loggedIn: false });
