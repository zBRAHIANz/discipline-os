/**
 * Fetch today's tasks for the user
 */
export async function fetchTodaysTasks() {
  const response = await fetch('/api/dashboard/tasks', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

/**
 * Complete a task
 */
export async function completeTask(taskId: string, proofUrl?: string) {
  const response = await fetch('/api/dashboard/tasks/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, proofUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete task');
  }

  return response.json();
}

/**
 * Fetch user's current progress
 */
export async function fetchProgress() {
  const response = await fetch('/api/dashboard/progress', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }

  return response.json();
}
