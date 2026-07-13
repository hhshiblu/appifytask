"use server";
import { revalidatePath } from "next/cache";
import { getServerHeaders } from "./cookies";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7050';

export async function getReplies(commentId, page = 1, limit = 20) {
  try {
    const res = await fetch(`${API_URL}/api/replys/${commentId}?page=${page}&limit=${limit}`, {
      headers: await getServerHeaders({ 'Content-Type': 'application/json' }),
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error getting replies:", error);
    return [];
  }
}

export async function createReply(formData) {
  try {
    const res = await fetch(`${API_URL}/api/replys`, {
      method: 'POST',
      body: formData,
      headers: await getServerHeaders(),
    });
    const data = await res.json();
    revalidatePath('/feed');
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
}
