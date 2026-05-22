import type { StatusChipVariant } from "@/components/common/StatusChip";

export type PropertyDocument = {
  id: string;
  fileName: string;
  fileType: string;
  type: string;
  lastUpdated: string;
};

export type PropertyItem = {
  id: string;
  propertyName: string;
  propertyId: string;
  leaseId: string;
  tenantName: string;
  status: StatusChipVariant;
  statusLabel: string;
  imageUrl?: string;
  documents: PropertyDocument[];
};
