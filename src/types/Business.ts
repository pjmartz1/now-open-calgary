export interface Business {
  id: string;
  business_name: string;
  trade_name?: string;
  business_type: string;
  address: string;
  community: string;
  ward: string;
  first_iss_dt: string;
  status: string;
  days_old: number;
  phone?: string;
  website?: string;
  featured?: boolean;
  featureType?: string;
  description?: string;
  hours?: string;
  images?: string[];
}

export interface FilterState {
  search: string;
  community: string;
  businessType: string;
  dateRange: string;
}

export interface ClaimRequest {
  businessId: string;
  ownerName: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
  verificationMethod: 'phone' | 'email';
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}