import { cookies } from 'next/headers';

export async function getServerHeaders(customHeaders = {}) {
  const token = (await cookies()).get('token')?.value;

  return {
    ...customHeaders,
    ...(token ? { Cookie: `token=${token}` } : {}),
  };
}
