export interface RepairRequestDraft {
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  problemDescription: string;
}

export interface RepairRequestErrors {
  deviceType?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  problemDescription?: string;
}
