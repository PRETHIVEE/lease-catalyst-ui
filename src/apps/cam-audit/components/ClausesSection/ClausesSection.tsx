import { cn } from "@/lib/utils";
import "./ClausesSection.scss";
import { useEffect, useState } from "react";
import CamReconciliationAPI from "@/api/cam-reconciliation";

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

const LineItem = ({ data }: { data: any }) => {
  const { Category, Amount, page_number, pdfCoordinates } = data;
  return (
    <article className={cn("clause-item shadow-md")}>
      <div className="clause-item__header">
        <h4
          className="clause-item__title"
          style={{ textTransform: "capitalize" }}
        >
          {Category}
        </h4>
      </div>

      <p className="clause-item__content">
        Amount :{" "}
        <strong>
          {Amount?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </strong>
      </p>

      <div className="clause-item__footer">
        <span>Page {page_number}</span>
        {"-"} <span className="clause-item__source">Source: CAM Statement</span>
      </div>
    </article>
  );
};

const ClausesSection = ({
  activeTab,
  auditId,
}: {
  activeTab: string;
  auditId: string;
}) => {
  const [includedCosts, setIncludedCosts] = useState([]);
  const [excludedCosts, setExcludedCosts] = useState([]);
  const [camLineItems, setCamLineItems] = useState([]);

  const getLeaseOperatingCosts = () => {
    CamReconciliationAPI.getLeaseOperatingCosts(auditId)
      .then((response) => {
        setIncludedCosts(response?.data?.included_costs || []);
        setExcludedCosts(response?.data?.excluded_costs || []);
      })
      .catch((error) => {
        console.error(error);
      });

    CamReconciliationAPI.getCamLineItems(auditId)
      .then((response) => {
        console.log("cam line items", response);
        setCamLineItems(response?.data || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getLeaseOperatingCosts();
  }, [auditId]);

  return (
    <div className="clauses-section">
      {activeTab === "lease-document" && (
        <>
          <div className="header-sec">EXTRACTED CLAUSES</div>
          <div className="content-sec h-[28vh] overflow-y-auto">
            <>
              <div className="subheader-sec ml-2 mt-1">Included Costs :</div>
              <div className="clause-list">
                {includedCosts.map((clause) => (
                  <ClauseItem key={clause.name} data={clause} />
                ))}
              </div>
            </>
            <>
              <div className="subheader-sec ml-2 mt-1">Excluded Costs :</div>
              <div className="clause-list">
                {excludedCosts.map((clause) => (
                  <ClauseItem key={clause.name} data={clause} />
                ))}
              </div>
            </>
          </div>
        </>
      )}

      {activeTab === "cam-statement" && (
        <>
          <div className="header-sec">Line Items</div>
          <div className="content-sec h-[28vh] overflow-y-auto">
            <>
              <div className="subheader-sec ml-2 mt-1">
                Expense Categories :
              </div>
              <div className="clause-list">
                {camLineItems.map((clause) => (
                  <LineItem key={clause.Category} data={clause} />
                ))}
              </div>
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default ClausesSection;
