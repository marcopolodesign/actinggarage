export function computeAge(birthdayStr: string): string {
  if (!birthdayStr) return '';
  const date = new Date(birthdayStr);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return String(age);
}
