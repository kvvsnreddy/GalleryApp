export interface User {
  fullName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  password: string;
  avatar?: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}
