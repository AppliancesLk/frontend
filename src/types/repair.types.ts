export type RepairStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'AWAITING_PARTS'
  | 'READY_FOR_COLLECTION'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DeviceInformation {
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate?: string;
}

export interface CreateRepairTicketRequest {
  device: DeviceInformation;
  problemDescription: string;
}

export interface RepairTicket {
  id: string;
  reference: string;
  customerId: string;
  assignedRepairerId: string | null;
  device: DeviceInformation;
  problemDescription: string;
  status: RepairStatus;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  id: string;
  username: string;
  email: string;
}

export interface AdminRepairTicket {
  id: string;
  reference: string;
  customer: CustomerInfo;
  assignedRepairerId: string | null;
  device: DeviceInformation;
  problemDescription: string;
  status: RepairStatus;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RejectRepairRequest {
  rejectionReason?: string;
}
