
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: UserRole;
  isBlocked: boolean;
}
export type UserRole = "customer" | "admin";

export interface AdminUserRecord {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole | string;
  isBlocked?: boolean;
}

export interface SidebarUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked?: boolean;
}

export interface AdminStats {
  totalCustomers: number;
  totalServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  successfulPayments: number;
}
export interface SidebarNavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}


export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface AppointmentItem {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  serviceCategory: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
  message?: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface SalonServiceItem {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number; // minutes
  image: string;
isActive: boolean;
  createdAt: string;
}

export interface TransactionItem {
  _id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}