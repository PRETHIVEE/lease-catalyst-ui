import { cn } from "@/lib/utils";
import "./ClausesSection.scss";

const ClauseItem = ({ data }: { data: any }) => {
  const { name, value, page_number, reason, pdfCoordinates } = data;
  return (
    <article className={cn("clause-item shadow-md")}>
      <div className="clause-item__header">
        <h4 className="clause-item__title">{name}</h4>
      </div>

      <p className="clause-item__content">
        {value} {reason && `- ${reason}`}
      </p>

      <div className="clause-item__footer">
        <span>Page {page_number}</span>{" "}
        <span className="clause-item__source">Source: Lease Document</span>
      </div>
    </article>
  );
};

const MOCK_CLAUSES = [
  {
    name: "Real Estate Taxes",
    value: "determined on an accrual basis",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 342.84,
      y0: 155.15,
      x1: 495.59,
      y1: 168.43,
    },
  },
  {
    name: "Insurance costs",
    value:
      "cost of all insurance carried by Landlord in connection with the Real Property",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 153.0,
      y0: 168.95,
      x1: 537.12,
      y1: 182.23,
    },
  },
  {
    name: "License, permit and inspection fees",
    value: "charged to Landlord by any governmental authority",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 237.36,
      y0: 196.55,
      x1: 514.92,
      y1: 209.83,
    },
  },
  {
    name: "Management fees",
    value: "payable to a third party and/or to Landlord or its affiliates",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 243.0,
      y0: 210.35,
      x1: 537.0,
      y1: 223.63,
    },
  },
  {
    name: "Repairs and maintenance",
    value: "of the Building, Land and Common Areas",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 153.0,
      y0: 237.95,
      x1: 543.0,
      y1: 265.03,
    },
  },
  {
    name: "Operation, maintenance, repair, replacement, inspection and servicing of equipment",
    value:
      "electrical, plumbing, heating, air conditioning and mechanical equipment",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 153.0,
      y0: 348.35,
      x1: 540.01,
      y1: 361.63,
    },
  },
  {
    name: "Janitorial services",
    value: "for the Building (not including the Premises)",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 153.0,
      y0: 375.95,
      x1: 543.0,
      y1: 403.03,
    },
  },
  {
    name: "Utility services",
    value:
      "including heat, air conditioning, electricity, gas, water and sewer",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 153.0,
      y0: 389.75,
      x1: 543.01,
      y1: 416.83,
    },
  },
  {
    name: "Costs under agreements",
    value:
      "reciprocal easement agreement, property declaration, operating agreement or other such agreement",
    page_number: 6,
    reason: "Explicitly listed as part of Operating Charges.",
    pdfCoordinates: {
      page: 6,
      page_width: 612.0,
      page_height: 792.0,
      x0: 153.0,
      y0: 403.55,
      x1: 543.01,
      y1: 444.43,
    },
  },
];

const ClausesSection = () => {
  return (
    <div className="clauses-section">
      <div className="header-sec">EXTRACTED CLAUSES</div>
      <div className="content-sec h-[28vh] overflow-y-auto">
        <>
          <div className="subheader-sec ml-2 mt-1">Included Costs :</div>
          <div className="clause-list">
            {MOCK_CLAUSES.map((clause) => (
              <ClauseItem key={clause.name} data={clause} />
            ))}
          </div>
        </>
        <>
          <div className="subheader-sec ml-2 mt-1">Excluded Costs :</div>
          <div className="clause-list">
            {MOCK_CLAUSES.map((clause) => (
              <ClauseItem key={clause.name} data={clause} />
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

export default ClausesSection;
