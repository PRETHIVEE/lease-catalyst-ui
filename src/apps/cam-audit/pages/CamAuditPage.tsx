import { useEffect, useState } from "react";
import BreadCrumbs from "../components/BreadCrumbs/BreadCrumbs";
import "./CamAuditPage.scss";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentsSection from "../components/DocumentsSection/DocumentsSection";
import ClausesSection from "../components/ClausesSection/ClausesSection";
import CamStats from "../components/CamStats/CamStats";
import ReviewHistory from "../components/ReviewHistory/ReviewHistory";
import { Button } from "@/components/ui/button";
import { Check, Download, Loader2, Save, X } from "lucide-react";
import EditableTable from "../components/EditableTable/EditableTable";
import ResultsTable from "../components/ResultsTable/ResultsTable";
// import {
//   sampleConsolidatedReconciliationData,
//   sampleLedgerData,
//   sampleMetricsData,
//   sampleResultsData,
// } from "./sampleData";
import InputLabel from "@/components/common/InputLabel";
import { TextField } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CamReconciliationAPI from "@/api/cam-reconciliation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSnackbarStore } from "@/store/snackbar-store";

const CamAuditPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbarStore();
  const { audit_id, lease_id } = Object.fromEntries(searchParams as any);
  const [activeTab, setActiveTab] = useState("project");
  const [activeCamAuditTab, setActiveCamAuditTab] = useState("CAM_LINE_ITEMS");
  const [triggerWidgetsFetch, setTriggerWidgetsFetch] = useState(Math.random());
  const [ledger, setLedger] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [results, setResults] = useState([]);
  const [consolidatedReconciliation, setConsolidatedReconciliation] = useState(
    [],
  );
  const [loadingConsolidatedData, setLoadingConsolidatedData] = useState(false);

  const breadcrumbItems = [
    { label: "CAM Audit", url: "/cam-reconciliation" },
    { label: lease_id, url: "/cam-reconciliation" },
    // { label: audit_id },
  ];

  const downloadExcel = async () => {
    try {
      const blob = await CamReconciliationAPI.downloadExcel(audit_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Unified_CAM_Audit_Grid_${audit_id}-Lease_${lease_id}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      console.log("Downloaded");
    }
  };

  useEffect(() => {
    getConsolidatedData();
    setTriggerWidgetsFetch(Math.random());
  }, [audit_id]);

  const getConsolidatedData = () => {
    setLoadingConsolidatedData(true);
    CamReconciliationAPI.getConsolidatedWorksheetsData(audit_id)
      .then((response) => {
        if (response?.status === 200) {
          const responseData = response?.data;
          setLedger(responseData?.cam_line_items || []);
          setMetrics(responseData?.audit_control_metrics || []);
          setResults(responseData?.unified_audit_grid || []);
          setConsolidatedReconciliation(
            responseData?.consolidated_summary || [],
          );
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingConsolidatedData(false);
      });
  };

  const onRecalculate = () => {
    setLoadingConsolidatedData(true);
    const requestBody = {
      cam_line_items: ledger,
      audit_control_metrics: metrics,
    };
    CamReconciliationAPI.updateRecaclWorksheetsData(audit_id, requestBody)
      .then()
      .catch()
      .finally(() => {
        getConsolidatedData();
        setTriggerWidgetsFetch(Math.random());
      });
  };

  const handleRejectAudit = () => {
    setLoadingConsolidatedData(true);
    setTimeout(() => {
      setLoadingConsolidatedData(false);
      showSnackbar("Audit rejected!", "error");
      navigate("/cam-reconciliation");
    }, 2000);
  };
  const handleApproveAudit = () => {
    setLoadingConsolidatedData(true);
    setTimeout(() => {
      setLoadingConsolidatedData(false);
      showSnackbar("Audit approved!");
      navigate("/cam-reconciliation");
    }, 2000);
  };

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

      {/* Right Area Section */}
      <section className="right-area">
        <ReviewHistory />
        <CamStats
          auditId={audit_id}
          triggerWidgetsFetch={triggerWidgetsFetch}
        />

        <div
          className="shadow-card"
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.2rem",
            marginTop: "1rem",
          }}
        >
          {/* Tabs Section */}
          <div className="cam-audit-tabs-sec ">
            <div className="cam-audit-tabs-list-sec">
              <Tabs
                value={activeCamAuditTab}
                onValueChange={setActiveCamAuditTab}
                className="gap-0"
              >
                <TabsList className="h-7.5">
                  <TabsTrigger value="CAM_LINE_ITEMS" className="h-7.5">
                    CAM LINE ITEMS
                  </TabsTrigger>
                  <TabsTrigger value="AUDIT_CONTROL_METRICS" className="h-7.5">
                    AUDIT CONTROL METRICS
                  </TabsTrigger>
                  <TabsTrigger value="CAM_RECONCILIATION" className="h-7.5">
                    CAM RECONCILIATION
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* */}
            <div className="cam-audit-tabs-buttons-sec">
              {activeCamAuditTab !== "CAM_RECONCILIATION" && (
                <Button variant="primary" onClick={onRecalculate} size="sm">
                  <Save aria-hidden />
                  Save & Re-Calculate
                </Button>
              )}

              {activeCamAuditTab === "CAM_RECONCILIATION" && (
                <>
                  <Button variant="primary" onClick={downloadExcel} size="sm">
                    <Download aria-hidden />
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>

          {loadingConsolidatedData && (
            <div className="table-sec">
              <Skeleton className="w-full h-10 mt-4" />
              <Skeleton className="w-full h-10 mt-2" />
              <Skeleton className="w-full h-10 mt-2" />
              <Skeleton className="w-full h-10 mt-2" />
            </div>
          )}

          {/* Table Section */}
          {activeCamAuditTab === "CAM_LINE_ITEMS" && (
            <div className="table-sec">
              <EditableTable
                columns={[
                  { key: "Category", label: "Category", width: "38%" },
                  {
                    key: "Amount",
                    label: "Amount ($)",
                    type: "number",
                    width: "28%",
                  },
                  {
                    key: "Included in Cap",
                    label: "In Cap",
                    type: "checkbox",
                    width: "14%",
                  },
                  // { key: "Lease Page", label: "Lease Page Ref.", width: "20%" },
                ]}
                rows={ledger}
                readOnlyKeys={["Lease Page"]}
                onChange={(i: any, key: any, val: any) =>
                  setLedger((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, [key]: val } : r,
                    ),
                  )
                }
              />
            </div>
          )}

          {activeCamAuditTab === "AUDIT_CONTROL_METRICS" && (
            <div className="table-sec">
              <EditableTable
                columns={[
                  { key: "Metric", label: "Metric", readOnly: true },
                  { key: "Value", label: "Value", type: "optional-number" },
                ]}
                rows={metrics}
                onChange={(i, key, val) =>
                  setMetrics((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, [key]: val } : r,
                    ),
                  )
                }
              />
            </div>
          )}

          {activeCamAuditTab === "CAM_RECONCILIATION" && (
            <div>
              <div className="table-sec">
                <ResultsTable
                  columns={[
                    { key: "Type", label: "Type", width: "5.5rem" },
                    {
                      key: "Description",
                      label: "Description",
                      width: "12rem",
                    },
                    {
                      key: "Current Yr Charge",
                      label: "Current Yr Charge ($)",
                      type: "optional-number",
                      width: "8.5rem",
                    },
                    {
                      key: "Prior Yr Amount",
                      label: "Prior Yr Amount ($)",
                      type: "optional-number",
                      width: "8.5rem",
                    },
                    {
                      key: "Cap Value",
                      label: "Cap Value ($)",
                      type: "optional-number",
                      width: "6.5rem",
                    },
                    {
                      key: "Variance",
                      label: "Variance ($)",
                      type: "optional-number",
                      width: "6rem",
                    },
                    {
                      key: "Pro-Rata (%)",
                      label: "Pro-Rata (%)",
                      type: "optional-number",
                      width: "6.5rem",
                    },
                    {
                      key: "Tenant Share",
                      label: "Tenant Share",
                      type: "optional-number",
                      width: "7rem",
                    },
                    {
                      key: "Status",
                      label: "Status",
                      type: "status",
                      width: "5.5rem",
                    },
                    {
                      key: "Reviewer Comment",
                      label: "Reviewer's Comment",
                      editable: true,
                      width: "14rem",
                    },
                  ]}
                  rows={results}
                  onChange={(i, key, val) =>
                    setResults((rows) =>
                      rows.map((r, idx) =>
                        idx === i ? { ...r, [key]: val } : r,
                      ),
                    )
                  }
                />
              </div>

              <div className="table-sec">
                <h4 className="header-sec mt-10.5">
                  Consolidated Reconciliation
                </h4>
                <ResultsTable
                  columns={[
                    { key: "Category", label: "Category" },
                    {
                      key: "Actual Property Exp.",
                      label: "Actual Property Exp ($) ",
                    },
                    {
                      key: "Recoverable Exp. (Allowed)",
                      label: "Recoverable Exp (Allowed) ($)",
                    },
                    {
                      key: "Pro-Rata (%)",
                      label: "Pro-Rata (%)",
                      type: "optional-number",
                    },
                    {
                      key: "Tenant Share",
                      label: "Tenant Share ($)",
                      type: "optional-number",
                    },
                    {
                      key: "Prior Billed (Escrow)",
                      label: "Prior Billed (Escrow) ($)",
                      type: "optional-number",
                    },
                    {
                      key: "Calculated Balance",
                      label: "Calculated Balance ($)",
                      type: "optional-number",
                    },
                    {
                      key: "Stated Balance Due",
                      label: "Stated Balance Due ($)",
                      type: "optional-number",
                    },
                    {
                      key: "Variance",
                      label: "Variance ($)",
                      type: "optional-number",
                    },
                  ]}
                  rows={consolidatedReconciliation}
                />
              </div>
            </div>
          )}
        </div>

        {/* Approval Section */}
        <div className="approval-sec shadow-card">
          <div>
            <InputLabel
              htmlFor="approval-comment"
              label="Reviewer's Comment (Optional)"
            />
            <TextField
              id="approval-comment"
              size="small"
              fullWidth
              multiline
              minRows={2}
              sx={{ fontSize: "0.79rem" }}
              // value={attributeDescription}
              // onChange={(event) => setAttributeDescription(event.target.value)}
            />
          </div>
          <div className="gap-2 flex justify-end mt-3">
            <Button
              variant="destructive"
              color="destructive"
              size="sm"
              onClick={handleRejectAudit}
              disabled={loadingConsolidatedData}
            >
              <X aria-hidden />
              {loadingConsolidatedData ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reject"
              )}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApproveAudit}
              disabled={loadingConsolidatedData}
            >
              <Check aria-hidden />
              {loadingConsolidatedData ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Approve Audit"
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CamAuditPage;
