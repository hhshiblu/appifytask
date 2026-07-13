const API_URL = process.env.NEXT_PUBLIC_API_URL ||process.env.API_URL || 'http://localhost:4000';

export async function getReplies(commentId, page = 1, limit = 20) {
  try {
    const res = await fetch(`${API_URL}/api/replys/${commentId}?page=${page}&limit=${limit}`);
  const data = await res.json();
  return {
    success: true,
    replies: data.data || [],
  };
  } catch {
    return {
      success: false,
      message: 'Failed to get replies',
    };
  }
}

export async function createReply(commentId, formData) {
  const content = formData.get('content')?.toString().trim() || '';
  const image = formData.get('image');

  if (!content && !(image instanceof File && image.size > 0)) {
    return { success: false, message: 'Reply cannot be empty' };
  }

  try {
    const res = await fetch(`${API_URL}/api/replys`, {
      method: 'POST',
      body: JSON.stringify({ commentId, content, image }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { success: true, id: data.data?.id };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
