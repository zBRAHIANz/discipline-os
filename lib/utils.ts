/**
 * Calculate time remaining until midnight UTC
 */
export function getTimeUntilMidnight(): {
  hours: number;
  minutes: number;
  seconds: number;
  percentage: number;
} {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const msRemaining = tomorrow.getTime() - now.getTime();
  const totalMsInDay = 24 * 60 * 60 * 1000;
  const percentage = (msRemaining / totalMsInDay) * 100;

  const seconds = Math.floor((msRemaining / 1000) % 60);
  const minutes = Math.floor((msRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((msRemaining / (1000 * 60 * 60)) % 24);

  return { hours, minutes, seconds, percentage: Math.max(0, percentage) };
}

/**
 * Format time remaining as readable string
 */
export function formatTimeRemaining(hours: number, minutes: number, seconds: number): string {
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Calculate XP for task completion
 */
export function calculateXP(difficulty: number, streak: number): number {
  const baseXP = 100;
  const difficultyMultiplier = 1 + (difficulty - 1) * 0.1;
  const streakBonus = 1 + (streak * 0.1); // +10% per day streak
  return Math.round(baseXP * difficultyMultiplier * streakBonus);
}

/**
 * Calculate level from XP
 */
export function calculateLevelFromXP(xp: number): number {
  const xpPerLevel = 1000;
  return Math.floor(xp / xpPerLevel);
}

/**
 * Format difficulty as badge color
 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 2) return 'bg-green-600';
  if (difficulty <= 4) return 'bg-blue-600';
  if (difficulty <= 6) return 'bg-yellow-600';
  if (difficulty <= 8) return 'bg-orange-600';
  return 'bg-red-600';
}

/**
 * Format difficulty as label
 */
export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 2) return 'EASY';
  if (difficulty <= 4) return 'MEDIUM';
  if (difficulty <= 6) return 'HARD';
  if (difficulty <= 8) return 'BRUTAL';
  return 'INSANE';
}

/**
 * Format category as label
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    make_money: '💰 EARN',
    fitness: '💪 FIT',
    discipline_study: '🧠 STUDY',
  };
  return labels[category] || category;
}
