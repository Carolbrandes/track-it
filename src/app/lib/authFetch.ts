/**
 * Wraps fetch and handles 401 (token expired) by logging out and redirecting to login.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: init?.credentials ?? 'include',
  });

  if (response.status === 401) {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch {
      /* best effort */
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return response;
}
