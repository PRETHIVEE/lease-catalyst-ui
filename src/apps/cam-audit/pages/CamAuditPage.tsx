import { useState } from "react";
import BreadCrumbs from "../components/BreadCrumbs/BreadCrumbs";
import "./CamAuditPage.scss";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentsSection from "../components/DocumentsSection/DocumentsSection";
import ClausesSection from "../components/ClausesSection/ClausesSection";

const breadcrumbItems = [
  { label: "CAM Audit", url: "/cam-reconciliation" },
  { label: "Riverstone Commons", url: "/cam-reconciliation" },
  { label: "LS-22841" },
];

const CamAuditPage = () => {
  const [activeTab, setActiveTab] = useState("project");

  return (
    <div className="cam-audit-page">
      <section className="left-area">
        {/* Breadcrumbs Section */}
        <div className="breadcrumbs-sec">
          <BreadCrumbs
            items={breadcrumbItems}
            currentPage="FY2025 Audit"
            auditorName="D. Okafor"
          />
        </div>

        {/* Tabs Section */}
        <div className="tab-sec">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-0"
          >
            <TabsList className="h-7.5">
              <TabsTrigger value="project" className="h-7.5">
                LEASE DOCUMENT
              </TabsTrigger>
              <TabsTrigger value="properties" className="h-7.5">
                CAM STATEMENT
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Document Section */}
        <div className="document-sec pt-0.25">
          <DocumentsSection />
        </div>

        <div className="clauses-sec">
          <ClausesSection />
        </div>
      </section>
      <section className="right-area">Right Area</section>
    </div>
  );
};

export default CamAuditPage;
