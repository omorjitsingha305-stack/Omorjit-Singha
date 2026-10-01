/**
 * Calculates exact age in years from an ISO date string (YYYY-MM-DD)
 */
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Returns formatted human-readable age text, e.g. "26 years old"
 */
export function formatAgeDescription(dobString: string): string {
  if (!dobString) return 'Enter DOB to calculate';
  
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 'Invalid date';

  const today = new Date();
  if (birthDate > today) return 'Future date not allowed';

  const age = calculateAge(dobString);
  if (age === 0) {
    // Under 1 year
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months <= 0) return 'Infant (< 1 month)';
    return `${months} month${months > 1 ? 's' : ''} old (Infant)`;
  }
  
  return `${age} year${age > 1 ? 's' : ''} old`;
}
