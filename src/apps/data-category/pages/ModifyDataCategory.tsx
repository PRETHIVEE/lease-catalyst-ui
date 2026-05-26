import DataCategoryAPI from "@/api/data-category";
import { useEffect, useState } from "react";
import { transformAttributes } from "../components/datatransfomer";
import BreadCrumbs from "@/components/common/BreadCrumbs";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Data Category", url: "/data-category" },
  { label: "Modify Data Category", url: "/" },
];

const ModifyDataCategory = () => {
  const [data, setData] = useState<any>(null);
  const [templateData, setTemplateData] = useState<any[]>([]);

  useEffect(() => {
    DataCategoryAPI.getDataCategory("Mobius Standard Abstraction").then(
      (response) => {
        if (response.status === 200) {
          const data = response.data[0];
          const transformedData = transformAttributes(data?.attributes);
          setData(data);
          setTemplateData(transformedData);
        }
      }
    );
  }, []);

  console.log("data", data, "templateData", templateData);
  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <h5 className="mt-4 text-[0.98rem] font-semibold text-font-color-primary">
        Modify Data Category
      </h5>

      <div
        style={{
          border: "1px dashed black",
          display: "flex",
          justifyContent: "center",
        }}
        className="p-2"
      >
        <div
          style={{ border: "1px solid red", width: "1000px" }}
          className="p-2"
        ></div>
      </div>
    </div>
  );
};

export default ModifyDataCategory;

const templateDataSample = [
  {
    groupName: "Details",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Premises Details",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Property name",
            attributeDescription:
              "Name of the property or complex where the leased premises is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street",
            attributeDescription: "Street name of the property address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street no.",
            attributeDescription: "Street number of the property address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Postal code",
            attributeDescription: "ZIP or postal code of the property address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "City",
            attributeDescription: "City where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "County",
            attributeDescription: "County where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "State / province",
            attributeDescription:
              "State or province where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Country",
            attributeDescription: "Country where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Building Type",
            attributeDescription:
              "Type or classification of the building (e.g., office, retail, industrial)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Total building area",
            attributeDescription: "Total area of the building in square units",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "UOM",
            attributeDescription:
              "Unit of measurement used for area (e.g., SF, SM)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Unit/suite number",
            attributeDescription: "Number of the leased unit or suite",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Type",
            attributeDescription:
              "Type of space leased (e.g., retail, office, warehouse)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Gross area",
            attributeDescription: "Total gross area of the leased premises",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Gross Area UOM",
            attributeDescription: "Unit of measurement for gross area",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Net area",
            attributeDescription: "Net usable area of the leased premises",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Net Area UOM",
            attributeDescription: "Unit of measurement for net area",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Floor no.",
            attributeDescription: "Floor number where the premises is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Start date",
            attributeDescription:
              "Start date of the lease for the specified unit/space",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "End date",
            attributeDescription:
              "End date of the lease for the specified unit/space",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Duration",
            attributeDescription:
              "Length of lease term for the specific premises",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Parties",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Landlord Name",
            attributeDescription: "Legal name of the landlord or lessor",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Tenant Name",
            attributeDescription: "Legal name of the tenant or lessee",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Contacts",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Contact type",
            attributeDescription:
              "Role or type of contact (e.g., landlord, tenant, broker)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Name",
            attributeDescription: "Name of the contact person or entity",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Attention",
            attributeDescription:
              "Person to whom correspondence is specifically addressed",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Care of",
            attributeDescription: "Secondary recipient or care-of entity",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "DBA",
            attributeDescription:
              "Doing business as name if different from legal name",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street",
            attributeDescription: "Street name of the contact address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street no.",
            attributeDescription: "Street number of the contact address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Suite",
            attributeDescription: "Suite number in the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "P.O. Box",
            attributeDescription: "Post office box number",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Zip code",
            attributeDescription: "ZIP or postal code of the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "City",
            attributeDescription: "City of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "County",
            attributeDescription: "County where the contact is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "State / province",
            attributeDescription: "State or province of the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Country",
            attributeDescription: "Country of the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Additional address details",
            attributeDescription: "Any additional descriptive address details",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Phone",
            attributeDescription: "Phone number of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Mobile",
            attributeDescription: "Mobile number of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Fax",
            attributeDescription: "Fax number of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Email",
            attributeDescription: "Email address of the contact",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Dates",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Key Dates",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Effective Date",
            attributeDescription:
              "Date the lease agreement becomes legally binding",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Execution Date",
            attributeDescription:
              "Date the lease agreement is signed by all parties",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Original Commencement Date",
            attributeDescription: "Initial start date of the lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Rent Commencement Date",
            attributeDescription:
              "Date on which rent payment obligations begin",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Current Commencement Date",
            attributeDescription: "Start date of the current lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Current Expiration Date",
            attributeDescription: "End date of the current lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Original Expiration Date",
            attributeDescription: "Initial end date of the lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Possession Date",
            attributeDescription:
              "Date the tenant takes possession of the premises",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Delivery Date",
            attributeDescription:
              "Date the premises are delivered to the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Term Duration",
            attributeDescription: "Total duration of the lease term in months",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Lease Status",
            attributeDescription:
              "Current status of the lease (e.g., pending, active, expired, terminated)",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Misc",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Misc",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "PRS",
            attributeDescription:
              "Pro-rata share of expenses borne by the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Base Year",
            attributeDescription:
              "Base year used for expense escalation calculations",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Monetory",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Base Rent",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Start date",
            attributeDescription: "Start date of the rent period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "End date",
            attributeDescription: "End date of the rent period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Monthly Amount",
            attributeDescription:
              "Monthly base rent amount payable by the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Monthly Amount per SF",
            attributeDescription: "Monthly rent amount per square foot",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Annual Amount",
            attributeDescription: "Total annual base rent amount",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Annual amount per SF",
            attributeDescription: "Annual rent amount per square foot",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Currency",
            attributeDescription: "Currency in which rent is payable",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "On Day",
            attributeDescription: "Day of the month on which rent is due",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Payment Frequency",
            attributeDescription:
              "Frequency of rent payments (e.g., monthly, quarterly)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount",
            attributeDescription: "Amount of rent increase",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount Unit",
            attributeDescription: "Unit for rent increase (e.g., %, $)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount per area",
            attributeDescription: "Amount of rent increase per unit area",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount per area Unit",
            attributeDescription: "Unit for increase per area (e.g., per SF)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Basis of increase",
            attributeDescription:
              "Reason or method of rent increase (e.g., CPI, fixed)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Rent Increase Start date",
            attributeDescription: "Start date of rent increase period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Rent Increase End date",
            attributeDescription: "End date of rent increase period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Interval",
            attributeDescription: "Time interval between rent increases",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Expense Items",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Electricity",
            attributeDescription:
              "Responsibility and terms for electricity charges",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Roof",
            attributeDescription: "Responsibility and terms for roof repairs",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "HVAC",
            attributeDescription:
              "Responsibility and terms for HVAC maintenance",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Common Area",
            attributeDescription: "Responsibility for maintaining shared areas",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Snow Removal",
            attributeDescription: "Responsibility for snow clearing",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Water",
            attributeDescription: "Responsibility and terms for water utility",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Trash",
            attributeDescription: "Responsibility for terms for trash removal",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Janitorial",
            attributeDescription:
              "Responsibility for terms for cleaning services",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Utility Lines",
            attributeDescription:
              "Responsibility for terms for utility infrastructure",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Security Deposit",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Security Deposit Type",
            attributeDescription:
              "Form in which the security deposit is held (e.g., cash, letter of credit)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Security Deposit Amount",
            attributeDescription: "Amount of the security deposit",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Security Deposit Currency",
            attributeDescription: "Currency of the security deposit amount",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Payment Date",
            attributeDescription: "Date the security deposit was paid",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Return Due Date",
            attributeDescription:
              "Deadline for returning the deposit to the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Security Deposit Comments",
            attributeDescription:
              "Additional notes or conditions related to the security deposit",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Allowance",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Allowance Type",
            attributeDescription:
              "Type of allowance provided (e.g., TI allowance, moving allowance)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Allowance Amount",
            attributeDescription: "Amount provided for the allowance",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Payment Deadline",
            attributeDescription: "Deadline for the payment of the allowance",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Allowance Comments",
            attributeDescription:
              "Additional notes or conditions related to the allowance",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Clauses",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Clauses",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Assignment/Sublet",
            attributeDescription:
              "Paraphrased paragraph of the Assignment/Sublet clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Alterations",
            attributeDescription:
              "Paraphrased paragraph of the Alterations clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Default",
            attributeDescription:
              "Paraphrased paragraph of the Default clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Continuous Operation",
            attributeDescription:
              "Paraphrased paragraph of the Continuous Operation clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Casualty",
            attributeDescription:
              "Paraphrased paragraph of the Casualty clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Condemnation",
            attributeDescription:
              "Paraphrased paragraph of the Condemnation clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Estoppel",
            attributeDescription:
              "Paraphrased paragraph of the Estoppel clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Business Hours",
            attributeDescription:
              "Paraphrased paragraph of the Business Hours clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Financial Statement",
            attributeDescription:
              "Paraphrased paragraph of the Financial Statement clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Late Charges",
            attributeDescription:
              "Paraphrased paragraph of the Late Charges clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Repair and Maintenance",
            attributeDescription:
              "Paraphrased paragraph of the Repair and Maintenance clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Insurance Requirements",
            attributeDescription:
              "Paraphrased paragraph of the Insurance Requirements clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Operating Expenses",
            attributeDescription:
              "Paraphrased paragraph of the Operating Expenses clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "RE Taxes",
            attributeDescription:
              "Paraphrased paragraph of the RE Taxes clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Property Insurance",
            attributeDescription:
              "Paraphrased paragraph of the Property Insurance clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Parking",
            attributeDescription:
              "Paraphrased paragraph of the Parking clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Signage",
            attributeDescription:
              "Paraphrased paragraph of the Signage clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "SNDA",
            attributeDescription:
              "Paraphrased paragraph of the SNDA clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Surrender",
            attributeDescription:
              "Paraphrased paragraph of the Surrender clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Holdover",
            attributeDescription:
              "Paraphrased paragraph of the Holdover clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Permitted Use",
            attributeDescription:
              "Paraphrased paragraph of the Permitted Use clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Restricted Uses",
            attributeDescription:
              "Paraphrased paragraph of the Restricted Uses clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Prohibited Uses",
            attributeDescription:
              "Paraphrased paragraph of the Prohibited Uses clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Exclusive Use",
            attributeDescription:
              "Paraphrased paragraph of the Exclusive Use clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Percentage Rent (Payment)",
            attributeDescription:
              "Paraphrased paragraph of the Percentage Rent (Payment) clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Gross Sales (Reporting)",
            attributeDescription:
              "Paraphrased paragraph of the Gross Sales (Reporting) clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Go dark",
            attributeDescription:
              "Paraphrased paragraph of the Go dark clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Co-Tenancy",
            attributeDescription:
              "Paraphrased paragraph of the Co-Tenancy clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Radius Restrictions",
            attributeDescription:
              "Paraphrased paragraph of the Radius Restrictions clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Tenant Improvement Allowance",
            attributeDescription:
              "Paraphrased paragraph of the Tenant Improvement Allowance clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Brokers",
            attributeDescription:
              "Paraphrased paragraph of the Brokers clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Notices",
            attributeDescription:
              "Paraphrased paragraph of the Notices clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Base Rent Comments",
            attributeDescription:
              "Paraphrased paragraph of the Base Rent Comments clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Utilities",
            attributeDescription:
              "Paraphrased paragraph of the Utilities clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Options",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Renewal Option",
            attributeDescription:
              "Paraphrased paragraph of the renewal option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Auto-Renewal Option",
            attributeDescription:
              "Paraphrased paragraph of the auto renewal option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Termination Option - One-Time",
            attributeDescription:
              "Paraphrased paragraph of the one time termination option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Termination Option - Ongoing",
            attributeDescription:
              "Paraphrased paragraph of the ongoing termination option clause from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Sales Kick Out",
            attributeDescription:
              "Paraphrased paragraph of the sales kick out from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Expansion Option",
            attributeDescription:
              "Paraphrased paragraph of the expansion option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Contraction Option",
            attributeDescription:
              "Paraphrased paragraph of the contraction option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "ROFO",
            attributeDescription:
              "Paraphrased paragraph of the ROFO option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "ROFR",
            attributeDescription:
              "Paraphrased paragraph of the ROFR option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Purchase",
            attributeDescription:
              "Paraphrased paragraph of the purchase option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Relocation",
            attributeDescription:
              "Paraphrased paragraph of the relocation option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
];
