const API_URL = process.env.NEXT_PUBLIC_API_URL ||process.env.API_URL || 'http://localhost:4000';

export async function toggleReact(targetId, targetType = 'post') {
  try {
    const res = await fetch(`${API_URL}/api/reacts`, {
      method: 'POST',
      body: JSON.stringify({ targetId, targetType }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { success: true, action: data.data?.action };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getReacts(targetId, targetType = 'post') {
  try {
    const res = await fetch(`${API_URL}/api/reacts/${targetType}/${targetId}`);
    const data = await res.json();
    return {
      success: true,
      reacts: data.data || [],
    };
  } catch {
    return {
      success: false,
      message: 'Failed to get reacts',
    };
  }
}
