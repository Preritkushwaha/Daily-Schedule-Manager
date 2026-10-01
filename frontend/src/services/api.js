const API_BASE_URL = '/api';

// Helper to get stored auth token
function getAuthHeaders() {
  const token = localStorage.getItem('schedule_jwt_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ----------------- Auth API -----------------

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Invalid email or password');
  }
  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Registration failed');
  }
  return res.json();
}

export async function fetchCurrentUser() {
  const token = localStorage.getItem('schedule_jwt_token');
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    localStorage.removeItem('schedule_jwt_token');
    return null;
  }
  return res.json();
}

// ----------------- Activities API (User Scoped) -----------------

export async function getActivities(date = null, status = null, category = null) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (status && status !== 'ALL') params.append('status', status);
  if (category && category !== 'ALL') params.append('category', category);

  const url = params.toString()
    ? `${API_BASE_URL}/activities?${params.toString()}`
    : `${API_BASE_URL}/activities`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem('schedule_jwt_token');
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch activities: ${res.statusText}`);
  }
  return res.json();
}

export async function getDailySummary(date = null) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  const url = params.toString()
    ? `${API_BASE_URL}/activities/summary?${params.toString()}`
    : `${API_BASE_URL}/activities/summary`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem('schedule_jwt_token');
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch daily summary: ${res.statusText}`);
  }
  return res.json();
}

export async function createActivity(activityData) {
  const res = await fetch(`${API_BASE_URL}/activities`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(activityData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create activity (${res.status})`);
  }
  return res.json();
}

export async function updateActivity(id, activityData) {
  const res = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(activityData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update activity (${res.status})`);
  }
  return res.json();
}

export async function updateActivityStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/activities/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update status (${res.status})`);
  }
  return res.json();
}

export async function deleteActivity(id) {
  const res = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to delete activity: ${res.statusText}`);
  }
  return true;
}
