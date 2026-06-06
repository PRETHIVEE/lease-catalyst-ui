export type PaymentType = "Base Rent" | "CAM" | "Percentage Rent";

export type RentEvent = {
  id: string;
  propertyCode: string;
  propertyName: string;
  address: string;
  tenantName: string;
  amount: number;
  paymentType: PaymentType;
  dueDate: string;
  notificationsMuted: boolean;
};

export type EventsMonthGroup = {
  monthKey: string;
  label: string;
  events: RentEvent[];
};
