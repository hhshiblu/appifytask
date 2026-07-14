"use server";
import { revalidatePath } from "next/cache";
import { getServerHeaders } from "./cookies";
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7050';
console.log('API_URL', API_URL);

export async function getComments(postId, { limit = 2, offset = 0 } = {}) {
  const res = await fetch(`${API_URL}/api/comments/${postId}?limit=${limit}&offset=${offset}`, {
    headers: await getServerHeaders({ 'Content-Type': 'application/json' }),
  });
  const data = await res.json();
  return {
    comments: data.data || [],
    total: data.total ?? 0,
    hasMore: data.hasMore ?? false,
  };
}

export async function createComment(formData) {
  try {
    const res = await fetch(`${API_URL}/api/comments`, {
      method: 'POST',
      body: formData,
      headers: await getServerHeaders(),
    });
    const data = await res.json();
    revalidatePath('/feed');
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, message: error.message || 'Failed to post comment' };
  }
}
