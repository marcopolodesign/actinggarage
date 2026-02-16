import { supabase } from './supabase'

export interface ContractData {
  id: string
  status: 'pending' | 'signed' | 'voided'
  student_name: string
  student_email: string
  contract_title: string
  contract_body: string
  contract_version: number
  created_at: string
  signed_at: string | null
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
  }): Promise<SignResponse> {
    const { data, error } = await supabase.rpc('sign_contract', {
      p_signing_token: params.signingToken,
      p_signature_data: params.signatureData,
      p_signer_name: params.signerName,
      p_signer_email: params.signerEmail,
      p_user_agent: params.userAgent,
      p_device_type: params.deviceType
    })
    if (error) throw error
    return data as SignResponse
  }
}
