export type UserRole = 'superadmin' | 'adminkantor' | 'adminworkshop' | 'karyawankantor' | 'karyawanworkshop';

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
}