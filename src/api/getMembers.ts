import axios from 'axios';
import type { MemberData } from './types';

const API_URL = '/api/get-members';

export interface GetMembersResponse {
  success: boolean;
  total_items?: number;
  members?: MemberData[];
  message?: string;
  error?: unknown;
}

export interface GetMembersParams {
  count?: number;
  offset?: number;
  status?: string;
}

export const getMembers = async (params: GetMembersParams = {}): Promise<GetMembersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.count) queryParams.append('count', params.count.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.status) queryParams.append('status', params.status);

    const url = `${API_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await axios.get<GetMembersResponse>(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('API error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch members',
      error: error.response?.data || error
    };
  }
};

