const API_URL = process.env.NEXT_PUBLIC_API_URL ||process.env.API_URL || 'http://localhost:4000';

export async function getComments(postId, { limit = 2, offset = 0 } = {}) {
  const res = await fetch(`${API_URL}/api/comments/${postId}?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return {
    comments: data.data || [],
    total: data.total ?? 0,
    hasMore: data.hasMore ?? false,
  };
}

export async function createComment(postId, formData) {
  const content = formData.get('content')?.toString().trim() || '';
  const image = formData.get('image');
  try {
  const res = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    body: JSON.stringify({ postId, content, image }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return {
    success: data.success,
    message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
