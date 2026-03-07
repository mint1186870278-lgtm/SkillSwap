/**
 * 中性头像选项 - 新用户随机分配
 */
export const NEUTRAL_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80', // 中性灰调
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80', // 中性
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', // 中性
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', // 中性
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', // 中性
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', // 中性
];

export function getRandomAvatar(): string {
  return NEUTRAL_AVATARS[Math.floor(Math.random() * NEUTRAL_AVATARS.length)];
}

/** 根据用户 id 生成稳定头像（同一用户始终得到同一头像） */
export function getAvatarForUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  const idx = Math.abs(hash) % NEUTRAL_AVATARS.length;
  return NEUTRAL_AVATARS[idx];
}
