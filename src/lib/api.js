import { PUBLIC_API_BASE } from '$env/static/public';

export function apiUrl(path) {
  return `${PUBLIC_API_BASE}${path}`;
}
