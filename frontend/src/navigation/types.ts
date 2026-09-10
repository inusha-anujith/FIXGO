import type { UserRole } from "../features/auth/types/role";

export type AuthStackParamList = {
  Welcome: undefined;
  RoleSelect: undefined;
  Login: { role: UserRole };
  Register: { role: UserRole };
};

// Add new Customer mapping and payment screens here
export type CustomerStackParamList = {
  CreateRequest: undefined;  // This will hold Map
  Payment: undefined;        // This will hold Payment Gateway 
};