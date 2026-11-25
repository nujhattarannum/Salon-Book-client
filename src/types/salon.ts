
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

export interface CustomerStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}

export interface CustomerAppointmentItem {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  serviceDuration?: number;
  servicePrice: number;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | string;
  paymentStatus: "paid" | "unpaid" | string;
  message?: string;
  createdAt: string;
}
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

export interface TransactionRecord {
  _id: string;
  transactionId?: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  amount: number;
  status: "paid" | "succeeded" | "pending" | "failed" | string;
  createdAt: string;
}