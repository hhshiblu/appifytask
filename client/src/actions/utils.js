export function getFirstName(user) {
  return user?.first_name || 'User';
}

export function getUserInitial(user) {
  return getFirstName(user).charAt(0).toUpperCase();
}

export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export function getUniqueUsers(items = []) {
  return Array.from(new Set(items.map((item) => item.user_id)));
}
