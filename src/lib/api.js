import { PUBLIC_API_BASE, PUBLIC_SWAGGER_URL } from '$env/static/public';

export function swaggerUrl(path) {
  return `${PUBLIC_SWAGGER_URL}${path}`;
}

export function apiUrl(path) {
  return `${PUBLIC_API_BASE}${path}`;
}


