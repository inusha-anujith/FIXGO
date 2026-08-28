import type { UserRole } from "../features/auth/types/role";

export type AuthStackParamList = {
  Welcome: undefined;
  RoleSelect: undefined;
  Login: { role: UserRole };
  Register: { role: UserRole };
};
