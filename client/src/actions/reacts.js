"use server";
import { revalidatePath } from "next/cache";
import { getServerHeaders } from "./cookies";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7050';

export async function toggleReact(targetId, targetType = 'post') {
  try {
    const res = await fetch(`${API_URL}/api/reacts`, {
      method: 'POST',
      body: JSON.stringify({ targetId, targetType }),
      headers: await getServerHeaders({ 'Content-Type': 'application/json' }),
    });
    const data = await res.json();
    revalidatePath('/feed')
    return { success: true, action: data.data?.action };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getReacts(targetId, targetType = 'post') {
  try {
    const res = await fetch(`${API_URL}/api/reacts/${targetType}/${targetId}`, {
      headers: await getServerHeaders({ 'Content-Type': 'application/json' }),
    });
    const data = await res.json();
    return data.data ;
  } catch (error) {
    console.error("Error getting reacts:", error);
    return [];
  }
}
