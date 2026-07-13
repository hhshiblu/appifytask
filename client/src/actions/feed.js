'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ||process.env.API_URL || 'http://localhost:4000';


export async function getFeeds(page = 1, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/api/feeds?page=${page}&limit=${limit}`);
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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return {
      success: data.success,
      message: data.message,
  }} 
  catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  
}