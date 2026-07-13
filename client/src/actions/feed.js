'use server';

import { getServerHeaders } from "./cookies";
import { revalidatePath } from "next/cache";
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7050';


export async function getFeeds(page = 1, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/api/feeds?page=${page}&limit=${limit}`, {
      cache: 'no-store',
      headers: await getServerHeaders({ 'Content-Type': 'application/json' }),
    });
    const data = await res.json();
  
    return {
      posts: data.data || [],
      page: data.page,
      hasMore: data.hasMore ?? false,
      offline: false,
    };
  } catch {
    return { posts: [], page, hasMore: false, offline: true };
  }
}

export async function createPost(formData) {
  try {
    const res = await fetch(`${API_URL}/api/feeds`, {
      method: 'POST',
      body: formData,
      headers: await getServerHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to create post' };
    }
    revalidatePath('/feed');
    return {
      success: data.success,
      message: 'Post created successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}