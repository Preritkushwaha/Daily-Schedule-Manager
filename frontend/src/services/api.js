const API_BASE_URL = '/api/activities';

export async function getActivities(date = null, status = null, category = null) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (status && status !== 'ALL') params.append('status', status);
  if (category && category !== 'ALL') params.append('category', category);

  const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch activities: ${res.statusText}`);
  }
  return res.json();
}

export async function getDailySummary(date = null) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  const url = params.toString() ? `${API_BASE_URL}/summary?${params.toString()}` : `${API_BASE_URL}/summary`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch daily summary: ${res.statusText}`);
  }
  return res.json();
}

export async function createActivity(activityData) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create activity (${res.status})`);
  }
  return res.json();
}

export async function updateActivity(id, activityData) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update activity (${res.status})`);
  }
  return res.json();
}

export async function updateActivityStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update status (${res.status})`);
  }
  return res.json();
}

export async function deleteActivity(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete activity: ${res.statusText}`);
  }
  return true;
}
