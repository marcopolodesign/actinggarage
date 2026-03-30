import { supabase } from './supabase'

export interface SignedFormData {
  total_price?: string | number | null
  enrollment_fee?: string | number | null
  payment_type?: 'pago_unico' | 'pago_fraccionado' | null
  installments?: number | null
  installment_amount?: string | number | null
  /** Student's wellbeing consent: 'authorize' | 'decline' */
  wellbeing_consent?: string | null
  /** Voluntary wellbeing / health info (información para tu bienestar) */
  wellbeing_notes?: string | null
}

export interface StudentUpdates {
  name?: string | null
  email?: string | null
  phone?: string | null
  date_of_birth?: string | null
  address?: string | null
  id_document?: string | null
  instagram?: string | null
  tiktok?: string | null
  tutor_full_name?: string | null
  tutor_id_document?: string | null
}

export interface ContractData {
  id: string
  status: 'pending' | 'signed' | 'voided'
  student_name: string
  student_email: string
  student_phone?: string | null
  student_date_of_birth?: string | null
  student_address?: string | null
  student_instagram?: string | null
  student_tiktok?: string | null
  student_id_document?: string | null
  enrollment_number?: string | null
  enrollment_date?: string | null
  tutor_full_name?: string | null
  tutor_id_document?: string | null
  contract_title: string
  contract_body: string
  contract_version: number
  created_at: string
  signed_at: string | null
  signature_data?: string | null
  signed_form_data?: SignedFormData | null
  course_name?: string | null
  course_schedule?: string | null
  course_start_date?: string | null
  course_end_date?: string | null
}

interface ContractResponse {
  success: boolean
  contract?: ContractData
  error?: string
}

interface SignResponse {
  success: boolean
  contract_id?: string
  signed_at?: string
  error?: string
}

export const contractService = {
  async getContractByToken(signingToken: string): Promise<ContractResponse> {
    const { data, error } = await supabase.rpc('get_contract_by_token', {
      p_signing_token: signingToken
    })
    if (error) throw error
    return data as ContractResponse
  },

  async signContract(params: {
    signingToken: string
    signatureData: string
    signerName: string
    signerEmail: string
    userAgent: string
    deviceType: string
    wellbeingNotes?: string | null
    studentUpdates?: StudentUpdates | null
    signedFormData?: SignedFormData | null
  }): Promise<SignResponse> {
    const { data, error } = await supabase.rpc('sign_contract', {
      p_signing_token: params.signingToken,
      p_signature_data: params.signatureData,
      p_signer_name: params.signerName,
      p_signer_email: params.signerEmail,
      p_user_agent: params.userAgent,
      p_device_type: params.deviceType,
      p_wellbeing_notes: params.wellbeingNotes || null,
      p_student_updates: params.studentUpdates ?? null,
      p_signed_form_data: params.signedFormData ?? null
    })
    if (error) throw error
    return data as SignResponse
  }
}
