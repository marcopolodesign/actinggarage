export interface FormSubmission {
  email: string;
  name: string;
  phone: string;
  birthday: string;
  age?: string;
  interests: string;
  gender?: string;
  course?: string;
  source: string;
  /** Ruta de la página desde la que se envió el form (ej: /iniciacion) */
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_id?: string;
  referral_reward?: string;
  /** Canal real detrás de la visita, aunque no traiga UTM (ej: instagram_organic, direct). */
  referrer_source?: string;
  /** Recorrido de la sesión hasta el envío, legible: "/cursos/garage-cinema → /cursos". */
  session_path?: string;
}

export interface MemberData {
  'Email Address': string;
  'First Name': string;
  'Last Name': string;
  'Address': string;
  'Phone Number': string;
  'Birthday': string;
  'Company': string;
  'Gender': string;
  'Interests': string;
  'Age': string;
  'Course': string;
  'Source': string;
  'UTM Source': string;
  'UTM Medium': string;
  'UTM Campaign': string;
  'MEMBER_RATING': number;
  'OPTIN_TIME': string;
  'OPTIN_IP': string;
  'CONFIRM_TIME': string;
  'CONFIRM_IP': string;
  'GMTOFF': string;
  'DSTOFF': string;
  'TIMEZONE': string;
  'CC': string;
  'REGION': string;
  'LAST_CHANGED': string;
  'LEID': string;
  'EUID': string;
  'NOTES': string;
  'TAGS': string;
}
