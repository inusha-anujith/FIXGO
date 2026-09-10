export type UserRole = "CUSTOMER" | "PROVIDER";

export const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: "Vehicle Owner",
  PROVIDER: "Garage / Service Provider",
};
