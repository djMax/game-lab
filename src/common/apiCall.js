export default async function apiCall(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
  });
  return response.json().catch(e => e);
}
