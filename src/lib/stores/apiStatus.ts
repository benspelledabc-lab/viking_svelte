import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";
export type ApiStatus = 'checking' | 'online' | 'offline';

export const apiStatus = writable<ApiStatus>('checking');

export async function checkApiStatus() {
	apiStatus.set('checking');

	try {
		// const res = await fetch('https://dev-api.spelledabc.org/api/v1/', {
		const res = await fetch(apiUrl(`/`));
		if (!res.ok) {
			throw new Error('Non-200 response');
		}

		const data = await res.json();

		if (data.status === 'healthy') {
			apiStatus.set('online');
		} else {
			apiStatus.set('offline');
		}
	} catch (err) {
		apiStatus.set('offline');
	}
}
