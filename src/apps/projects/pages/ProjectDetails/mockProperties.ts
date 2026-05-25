import type { PropertyItem } from "../../components/PropertyCard/types";

export const mockProperties: PropertyItem[] = [
  {
    id: "prp-1",
    propertyName: "Boardman",
    propertyId: "PRP-90210",
    leaseId: "LSE-4421",
    tenantName: "John Doe",
    status: "success",
    statusLabel: "success",
    imageUrl:
      "https://larken.co.uk/images/Home_Menu_Services/Commercial-property.svg",
    documents: [
      {
        id: "doc-1",
        fileName: "Lease_Agreement_2024.pdf",
        fileType: "PDF",
        type: "Legal / Contract",
        lastUpdated: "2023-10-12",
      },
      {
        id: "doc-2",
        fileName: "Insurance_Certificate.pdf",
        fileType: "PDF",
        type: "Compliance",
        lastUpdated: "2023-09-28",
      },
      {
        id: "doc-3",
        fileName: "Floor_Plan_Level_4.dwg",
        fileType: "DWG",
        type: "Operations",
        lastUpdated: "2023-08-15",
      },
    ],
  },
  {
    id: "prp-2",
    propertyName: "Skyline Tower",
    propertyId: "PRP-88421",
    leaseId: "LSE-9902",
    tenantName: "Acme Corp",
    status: "pending",
    statusLabel: "pending",
    imageUrl:
      "https://larken.co.uk/images/Home_Menu_Services/Commercial-property.svg",
    documents: [
      {
        id: "doc-4",
        fileName: "Master_Lease_Skyline.pdf",
        fileType: "PDF",
        type: "Legal / Contract",
        lastUpdated: "2024-01-05",
      },
      {
        id: "doc-5",
        fileName: "CAM_Reconciliation.xlsx",
        fileType: "XLSX",
        type: "Financial",
        lastUpdated: "2023-11-20",
      },
    ],
  },
];
