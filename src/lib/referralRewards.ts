export const REFERRAL_REWARD_OPTIONS = [
  { value: 'matricula_gratis', label: 'Matrícula gratis' },
  { value: 'descuento_5', label: '5% de descuento' },
  { value: 'sudadera', label: 'Sudadera TAG' },
  { value: 'sesion_fotos', label: 'Sesión de fotos' },
] as const;

export const PHOTO_SESSION_OPTIONS = [
  { value: 'book', label: 'Fotos book' },
  { value: 'artistica', label: 'Fotos artísticas' },
] as const;

export const REFERRAL_REWARD_LABELS: Record<string, string> = {
  matricula_gratis: 'Matrícula gratis',
  descuento_5: '5% de descuento',
  sudadera: 'Sudadera TAG',
  sesion_fotos_book: 'Sesión de fotos (book)',
  sesion_fotos_artistica: 'Sesión de fotos (artística)',
};

export function buildReferralRewardValue(reward: string, photoSessionType: string): string {
  if (reward === 'sesion_fotos') {
    return photoSessionType === 'artistica' ? 'sesion_fotos_artistica' : 'sesion_fotos_book';
  }
  return reward;
}

export function getReferralRewardLabel(referralReward: string | null | undefined): string {
  if (!referralReward) return 'tu regalo';
  return REFERRAL_REWARD_LABELS[referralReward] || referralReward;
}
